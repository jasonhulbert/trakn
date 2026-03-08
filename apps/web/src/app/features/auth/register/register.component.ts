import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  UiButtonDirective,
  UiFormFieldDirective,
  UiInputDirective,
  UiLabelDirective,
  UiToastService,
} from 'src/app/shared/components';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, UiFormFieldDirective, UiLabelDirective, UiInputDirective, UiButtonDirective],
  template: `
    <div class="flex flex-col space-y-6 w-full">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>
      <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
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
          <a routerLink="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </a>
        </div>
      </form>
    </div>
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
