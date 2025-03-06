import { Component, inject, OnInit } from '@angular/core';
import {SvgIconComponent} from '../svg/svg-icon.component';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {ProfileService} from '../../data/services/profile.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    SubscriberCardComponent,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    NgForOf,
    ImgUrlPipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  profileService = inject(ProfileService)

  subscribers$ = this.profileService.getSubscribersShortList(3);

  me = this.profileService.me;

  menuItems = [
    {
      label: 'Моя сторінка',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чати',
      icon: 'chat',
      link: 'chats'
    },
    {
      label: 'Пошук',
      icon: 'search',
      link: 'search'
    },
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
