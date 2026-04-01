import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user-profile.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, IconComponent],
  template: `
    <nav class="border-b border-base-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-14">
          <div class="flex">
            <a routerLink="/" class="shrink-0 flex items-center">
              <h1 class="text-lg font-bold tracking-wide text-fore-300 uppercase">Trakn</h1>
            </a>
          </div>
          <div class="flex items-center space-x-6 text-fore-500">
            <a routerLink="/profile" class="w-5 h-5 flex-none transition-colors hover:text-accent-500">
              <app-icon name="profile-circle" variant="regular" class="w-full h-full"></app-icon>
            </a>
            <button (click)="signOut()" type="button" class="w-5 h-5 flex-none cursor-pointer transition-colors hover:text-accent-500">
              <app-icon name="log-out" variant="regular" class="w-full h-full"></app-icon>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class Navbar {
  private readonly authService = inject(AuthService);
  readonly userProfileService = inject(UserProfileService);

  async signOut() {
    await this.authService.signOut();
  }
}
