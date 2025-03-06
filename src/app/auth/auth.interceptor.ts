import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http'
import {AuthService} from './auth.service';
import { inject } from '@angular/core';
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError } from 'rxjs';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (!token) {
    console.log(request);
    return next(request);
  }

  if (isRefreshing$.value) {
    return refreshAndProceed(authService, request, next);
  }

  request = addToken(request, token);
  return next(request)
    .pipe(
      catchError(error => {
        if (error.status === 403) {
          return refreshAndProceed(authService, request, next);
        }
        return throwError(error);
      })
    );
}

const refreshAndProceed = (
  authService: AuthService,
  request: HttpRequest<any>,
  nextFn: HttpHandlerFn
) => {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);

    return authService.refreshAuthToken()
      .pipe(
        switchMap(tokenResponse => {
          return nextFn(addToken(request, tokenResponse.access_token)).pipe(
            //рефреш пройшов, поміняли значення
            tap(() => isRefreshing$.next(false))
          )
        })
      )
  }
  //1 варіант - оновився токен, і ми виконали тільки запит me, а інші не оновилися...
  // return nextFn(addToken(request, authService.token!/*перевіряли раніше на null, тому так...*/))
  //якщо це рефреш-запит, то оновлюємо токен
  if (request.url.includes('refresh')) {
    return nextFn(addToken(request, authService.token!))
  }
  //підписалися на рефреш - якщо не пройшов(false, це коли він закінчився), то нічого не робимо, а якщо пройшов, оновлюємо токен
  return isRefreshing$.pipe(
    filter(isRefreshing => !isRefreshing),
    switchMap(res => {
      //відускає запроси які тримав
      return nextFn(addToken(request, authService.token!))
    })
  )
}

const addToken = (request: HttpRequest<any>, token: string)=> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
