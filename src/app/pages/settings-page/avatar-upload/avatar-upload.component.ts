import { Component, inject, signal } from '@angular/core';
import {SvgIconComponent} from '../../../common-ui/svg/svg-icon.component';
import {ProfileService} from '../../../data/services/profile.service';
import {DndDirective} from '../../../common-ui/directives/dnd.directive';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-avatar-upload',
  imports: [
    SvgIconComponent,
    DndDirective,
    FormsModule
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  profileService = inject(ProfileService);
  preview = signal<string>('/assets/images/test_user_ws.png');
  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.processFile(file);

  }

  onFileDropped(file: File) {
    this.processFile(file);

  }

  private processFile(file: File | undefined) {
    if (!file || !file.type.match('image')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = event => {
      const payload = event.target?.result?.toString() ?? null;
      if (!payload) {
        return;
      }
      this.preview.set(event.target?.result?.toString() ?? '')
    }
    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
