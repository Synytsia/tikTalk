import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {Profile} from '../interfaces/profile.interface';
import {Pageble} from '../interfaces/pageble.interface';
import {TokenResponse} from '../../auth/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  httpClient = inject(HttpClient)
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  me = signal<Profile | null>(null);
  filteredProfiles = signal<Profile[]>([]);

  getTestAccounts(): Observable<Profile[]> {
    // const tempUrl = this.baseApiUrl + 'account/test_accounts';
    return this.httpClient.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.httpClient.get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(
        tap(res => this.me.set(res))
      );
  }

  getAccount(id: string) {
    return this.httpClient.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  getSubscribersShortList(count: number) {
    return this.httpClient.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0, count))
      );
  }

  patchProfile(profile:Partial<Profile>) {
    return this.httpClient.patch(
      `${this.baseApiUrl}account/me`,
      profile)
  }

  uploadImage(file: File) {
    const fd = new FormData()
    fd.append('image', file)
    return this.httpClient.post<TokenResponse>(`${this.baseApiUrl}account/upload_image`, fd).pipe(
      tap(res => {
        this.getMe();
        console.log("TTTTTTTTT")
        console.log(res)
      })
    );
  }

  filterProfiles(params: Record<string, any>) {
    return this.httpClient.get<Pageble<Profile>>(
      `${this.baseApiUrl}account/accounts`,
      {
        params
      }
    ).pipe(
      tap(res => this.filteredProfiles.set(res.items))
    );
  }
}
