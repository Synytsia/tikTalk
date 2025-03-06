import { Component } from '@angular/core';
import {ProfileCardComponent} from '../../common-ui/profile-card/profile-card.component';
import {inject} from '@angular/core';
import {ProfileService} from '../../data/services/profile.service';
import {ProfileFiltersComponent} from './profile-filters/profile-filters.component';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCardComponent,
    ProfileFiltersComponent,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  title = 'angular_tik_talk';
  profileService = inject(ProfileService);
  profiles = this.profileService.filteredProfiles;

  //ТЕСТОВІ КОРИСТУВАЧІ:
  /* 1)старий спосіб
  // profiles: Profile[] = [];

  // constructor() {
  //   this.profileService.getTestAccounts()
  //     .subscribe(value => {
  //       this.profiles = value;
  //     })
  // }*/
  // @for (profile of profiles; track profile.id) {
  //   <app-profile-card [profile]="profile"></app-profile-card>
  // }


  // 2) з AsyncPipe і стрімом
  // profiles$ = this.profileService.getTestAccounts();
  // @for (profile of profiles$ | async; track profile.id) {
  //   <app-profile-card [profile]="profile"></app-profile-card>
  // }


}
