import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Profile} from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  httpClient = inject(HttpClient)
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  getTestAccounts(): Observable<Profile[]> {
    // const tempUrl = this.baseApiUrl + 'account/test_accounts';
    return this.httpClient.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.httpClient.get<Profile>(`${this.baseApiUrl}account/me`);
  }
}
