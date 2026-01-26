import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Trakn</h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          @if (error()) {
            <div class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-800">{{ error() }}</p>
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
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="isLoading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading() ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a routerLink="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
                Don't have an account? Sign up
              </a>
            </div>
          </div>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                (click)="signInWithGoogle()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Google
              </button>
              <button
                type="button"
                (click)="signInWithApple()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Apple
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = signal(false);
  error = signal<string | null>(null);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async onSubmit() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.authService.signIn(this.email, this.password);
      await this.router.navigate(['/']);
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.error.set(anyErr.message || 'Failed to sign in');
    } finally {
      this.isLoading.set(false);
    }
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.error.set(anyErr.message || 'Failed to sign in with Google');
    }
  }

  async signInWithApple() {
    try {
      await this.authService.signInWithApple();
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.error.set(anyErr.message || 'Failed to sign in with Apple');
    }
  }
}
