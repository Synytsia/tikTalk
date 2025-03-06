import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap, throwError } from 'rxjs';
import {TokenResponse} from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpClient = inject(HttpClient)
  cookieService = inject(CookieService)
  router = inject(Router)
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

  //5хв - час життя токену на сервері
  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth(): boolean {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.token;
  }

  login(payload: { username: string, password: string }) {
    const fd = new FormData()
    fd.append('username', payload.username)
    fd.append('password', payload.password)
    return this.httpClient.post<TokenResponse>(`${this.baseApiUrl}token`, fd).pipe(
      tap(res => {
        this.saveTokens(res)
      })
    );
  }

  refreshAuthToken() {
    return this.httpClient.post<TokenResponse>(
      `${this.baseApiUrl}refresh`,
      {refresh_token: this.refreshToken}
    ).pipe(
      tap(res => {
        this.saveTokens(res)
      }),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  private logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }

  private saveTokens(response: TokenResponse) {
    this.token = response.access_token
    this.refreshToken = response.refresh_token
    this.cookieService.set('token', this.token)
    this.cookieService.set('refreshToken', this.refreshToken)
  }
}
