import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  UiButtonDirective,
  UiFormFieldDirective,
  UiInputDirective,
  UiLabelDirective,
  UiPatternHeroComponent,
  UiToastService,
} from 'src/app/shared/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, UiFormFieldDirective, UiLabelDirective, UiInputDirective, UiButtonDirective, UiPatternHeroComponent],
  template: `
    <div class="relative mb-8 h-48 -mx-4 overflow-hidden">
      <ui-pattern-hero class="absolute inset-0" />
      <div class="relative z-10 flex items-center justify-center h-full">
        <h2 class="text-3xl font-extrabold text-fore-300">Sign in to Trakn</h2>
      </div>
    </div>
    <form class="space-y-6" (ngSubmit)="onSubmit()">
      <div uiFormField>
        <label uiLabel for="email">Email address</label>
        <input
          uiInput
          id="email"
          name="email"
          type="email"
          [(ngModel)]="email"
          required
          placeholder="Email address"
        />
      </div>

      <div uiFormField>
        <label uiLabel for="password">Password</label>
        <input
          uiInput
          id="password"
          name="password"
          type="password"
          [(ngModel)]="password"
          required
          placeholder="Password"
        />
      </div>

      <div>
        <button type="submit" uiButton class="w-full" [disabled]="isLoading()">
          {{ isLoading() ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm">
          <a routerLink="/auth/register" class="font-medium text-accent-500 hover:text-accent-400">
            Don't have an account? Sign up
          </a>
        </div>
      </div>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-base-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-bg text-fore-600">Or continue with</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button type="button" uiButton (click)="signInWithGoogle()">Google</button>
          <button type="button" uiButton (click)="signInWithApple()">Apple</button>
        </div>
      </div>
    </form>
  `,
  host: {
    class: 'block w-full max-w-md m-auto',
  },
  styles: [],
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(UiToastService);

  async onSubmit() {
    this.isLoading.set(true);

    try {
      await this.authService.signIn(this.email, this.password);
      await this.router.navigate(['/']);
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.toast.error(anyErr.message || 'Failed to sign in');
    } finally {
      this.isLoading.set(false);
    }
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.toast.error(anyErr.message || 'Failed to sign in with Google');
    }
  }

  async signInWithApple() {
    try {
      await this.authService.signInWithApple();
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.toast.error(anyErr.message || 'Failed to sign in with Apple');
    }
  }
}
