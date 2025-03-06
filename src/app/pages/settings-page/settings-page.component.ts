import { Component, effect, inject, ViewChild } from '@angular/core';
import {ProfileHeaderComponent} from '../../common-ui/profile-header/profile-header.component';
import {FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {ProfileService} from '../../data/services/profile.service';
import { firstValueFrom } from 'rxjs';
import {AvatarUploadComponent} from './avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    AvatarUploadComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  profileService = inject(ProfileService);
  fb = inject(FormBuilder);

  //костилідзе
  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{value:'', disabled: true}, Validators.required],
    description: [''],
    stack: ['']
  })

  constructor() {
    effect(() => {
      // @ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        // @ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack)
      })

    });
  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    if (this.avatarUploader.avatar) {
      console.log(this.avatarUploader.avatar);
      firstValueFrom(this.profileService.uploadImage(this.avatarUploader.avatar));
    }

    // @ts-ignore
    firstValueFrom(this.profileService.patchProfile({
      ...this.form.value,
      stack: this.splitStack(this.form.value.stack)
    }));
  }

  private splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) {
      return [];
    }
    if (Array.isArray(stack)) {
      return stack;
    }
    return stack.split(',');
  }

  private mergeStack(array: string[] | null | string): string {
    if (!array) {
      return '';
    }
    if (Array.isArray(array)) {
      return array.join(',')
    }
    return array;
  }
}
