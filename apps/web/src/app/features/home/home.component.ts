import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-900">Trakn</h1>
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
