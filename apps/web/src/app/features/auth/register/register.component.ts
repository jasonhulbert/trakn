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
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, UiFormFieldDirective, UiLabelDirective, UiInputDirective, UiButtonDirective, UiPatternHeroComponent],
  template: `
    <div class="relative mb-8 h-48 -mx-4 overflow-hidden">
      <ui-pattern-hero class="absolute inset-0" />
      <div class="relative z-10 flex items-center justify-center h-full">
        <h2 class="text-3xl font-extrabold text-fore-300">Create your account</h2>
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
          placeholder="Password (min. 8 characters)"
        />
      </div>

      <div>
        <button type="submit" uiButton class="w-full" [disabled]="isLoading()">
          {{ isLoading() ? 'Creating account...' : 'Sign up' }}
        </button>
      </div>

      <div class="text-sm text-center">
        <a routerLink="/auth/login" class="font-medium text-accent-500 hover:text-accent-400">
          Already have an account? Sign in
        </a>
      </div>
    </form>
  `,
  host: {
    class: 'block w-full max-w-md m-auto',
  },
  styles: [],
})
export class RegisterComponent {
  email = '';
  password = '';
  isLoading = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(UiToastService);

  async onSubmit() {
    if (this.password.length < 8) {
      this.toast.error('Password must be at least 8 characters long');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.authService.signUp(this.email, this.password);
      this.toast.success('Account created! Please check your email to confirm your account.', 'Success');
      this.email = '';
      this.password = '';
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.toast.error(anyErr.message || 'Failed to create account');
    } finally {
      this.isLoading.set(false);
    }
  }
}
