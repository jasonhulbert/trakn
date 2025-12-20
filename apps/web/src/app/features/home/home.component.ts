import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-900">Trakn</h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  routerLink="/workouts"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Workouts
                </a>
                <a
                  routerLink="/history"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  History
                </a>
                <a
                  routerLink="/profile"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Profile
                </a>
              </div>
            </div>
            <div class="flex items-center">
              <button
                (click)="signOut()"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="py-10">
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="px-4 py-8 sm:px-0">
              <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Welcome to Trakn</h2>
                <p class="mt-4 text-lg text-gray-500">Your workout planning and logging application</p>
              </div>

              <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div class="bg-white overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="text-sm font-medium text-gray-500 truncate">Start Workout</dt>
                          <dd class="mt-1 text-lg font-semibold text-gray-900">
                            <a routerLink="/workouts" class="text-indigo-600 hover:text-indigo-500">
                              Browse workouts →
                            </a>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="text-sm font-medium text-gray-500 truncate">View History</dt>
                          <dd class="mt-1 text-lg font-semibold text-gray-900">
                            <a routerLink="/history" class="text-indigo-600 hover:text-indigo-500">
                              See past workouts →
                            </a>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="text-sm font-medium text-gray-500 truncate">Setup Profile</dt>
                          <dd class="mt-1 text-lg font-semibold text-gray-900">
                            <a routerLink="/profile" class="text-indigo-600 hover:text-indigo-500">
                              Configure equipment →
                            </a>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [],
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  async signOut() {
    await this.authService.signOut();
  }
}
