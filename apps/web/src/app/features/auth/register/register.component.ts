import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="flex flex-col w-full max-w-md space-y-8 m-auto">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>
      <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
        @if (error()) {
          <div class="rounded-md bg-red-50 p-4">
            <p class="text-sm text-red-800">{{ error() }}</p>
          </div>
        }
        @if (success()) {
          <div class="rounded-md bg-green-50 p-4">
            <p class="text-sm text-green-800">{{ success() }}</p>
          </div>
        }

        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              [(ngModel)]="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password (min. 8 characters)"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            [disabled]="isLoading()"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ isLoading() ? 'Creating account...' : 'Sign up' }}
          </button>
        </div>

        <div class="text-sm text-center">
          <a routerLink="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </a>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class RegisterComponent {
  email = '';
  password = '';
  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async onSubmit() {
    if (this.password.length < 8) {
      this.error.set('Password must be at least 8 characters long');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      await this.authService.signUp(this.email, this.password);
      this.success.set('Account created! Please check your email to confirm your account.');
      this.email = '';
      this.password = '';
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.error.set(anyErr.message || 'Failed to create account');
    } finally {
      this.isLoading.set(false);
    }
  }
}
