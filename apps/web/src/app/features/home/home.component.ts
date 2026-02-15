import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserProfileService } from '../../core/services/user-profile.service';
import { Header } from 'src/app/shared/components/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Header],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>

      <div class="py-10">
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="px-4 py-8 sm:px-0">
              <div class="text-center mb-8">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Welcome to Trakn</h2>
              </div>

              <!-- Conditional CTA based on profile status -->
              @if (!userProfileService.hasProfile()) {
                <!-- Complete Profile CTA -->
                <div class="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 class="text-lg font-medium text-yellow-900 mb-2">Complete Your Profile</h3>
                  <p class="text-sm text-yellow-700 mb-4">
                    Tell us about yourself to get personalized workout recommendations.
                  </p>
                  <a
                    routerLink="/profile"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-900 bg-yellow-100 hover:bg-yellow-200"
                  >
                    Set Up Profile
                  </a>
                </div>
              } @else {
                <!-- New Workout Button -->
                <div class="text-center">
                  <a
                    routerLink="/workouts/new"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create New Workout
                  </a>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [],
})
export class HomeComponent {
  readonly userProfileService = inject(UserProfileService);
}
