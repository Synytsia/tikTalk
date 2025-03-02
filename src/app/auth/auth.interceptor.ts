import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http'
import {AuthService} from './auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (!token) {
    console.log(request);
    return next(request);
  }

  if (isRefreshing) {
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
  if (!isRefreshing) {
    isRefreshing = true;

    return authService.refreshAuthToken()
      .pipe(
        switchMap(tokenResponse => {
          isRefreshing = false;
          return nextFn(addToken(request, tokenResponse.access_token))
        })
      )
  }

  return nextFn(addToken(request, authService.token!/*перевіряли раніше на null, тому так...*/))
}

const addToken = (request: HttpRequest<any>, token: string)=> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
