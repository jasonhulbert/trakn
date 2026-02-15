import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user-profile.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <a routerLink="/" class="shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Trakn</h1>
            </a>
          </div>
          <div class="flex items-center space-x-4">
            <a routerLink="/profile" class="text-gray-600 hover:text-gray-900 text-sm"> Profile </a>
            <button
              (click)="signOut()"
              class="inline-flex items-center px-2 py-1 border border-transparent text-sm rounded-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: ``,
})
export class Header {
  private readonly authService = inject(AuthService);
  readonly userProfileService = inject(UserProfileService);

  async signOut() {
    await this.authService.signOut();
  }
}
