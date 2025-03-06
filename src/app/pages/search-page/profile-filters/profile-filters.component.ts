import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {ProfileService} from '../../../data/services/profile.service';
import {debounceTime, startWith, Subscription, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-filters',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent implements OnDestroy{
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  searchFormSub: Subscription;

  searchForm = this.fb.group({
      firstName: [''],
      lastName: ['',],
      stack: ['']
  })

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        //стартуэмо з порожнього запиту
        startWith({}),
        //чекаємо 300 мс, а потім - запит
        //якщо за цей час прийде нове значення, старе видаляємо і знову чекаємо 300 мс
        debounceTime(300),
        switchMap(formValue => {
          return this.profileService.filterProfiles(formValue);
        }),
        //Angular 17 - з Injection-контекста закриває підписку(слухача)
        takeUntilDestroyed()
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.searchFormSub.unsubscribe();
  }


}
