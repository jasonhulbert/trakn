import { Component, inject, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import type { UserProfile } from '@trkn-shared';
import { UserProfileService } from '../../core/services/user-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (userProfileService.isLoading()) {
      <div class="text-center">
        <p class="text-gray-600">Loading profile...</p>
      </div>
    } @else {
      <div class="bg-white shadow rounded-lg">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          @if (error()) {
            <div class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-800">{{ error() }}</p>
            </div>
          }

          @if (successMessage()) {
            <div class="rounded-md bg-green-50 p-4">
              <p class="text-sm text-green-800">{{ successMessage() }}</p>
            </div>
          }

          <!-- Age -->
          <div>
            <label for="age" class="block text-sm font-medium text-gray-700"> Age * </label>
            <input
              id="age"
              formControlName="age"
              type="number"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              [class.border-red-300]="profileForm.get('age')?.touched && profileForm.get('age')?.invalid"
            />
            @if (getFieldError('age')) {
              <p class="mt-1 text-sm text-red-600">{{ getFieldError('age') }}</p>
            }
          </div>

          <!-- Weight + Unit -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="weight" class="block text-sm font-medium text-gray-700"> Weight * </label>
              <input
                id="weight"
                formControlName="weight"
                type="number"
                step="0.1"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                [class.border-red-300]="profileForm.get('weight')?.touched && profileForm.get('weight')?.invalid"
              />
              @if (getFieldError('weight')) {
                <p class="mt-1 text-sm text-red-600">{{ getFieldError('weight') }}</p>
              }
            </div>
            <div>
              <label for="weight_unit" class="block text-sm font-medium text-gray-700"> Unit * </label>
              <select
                id="weight_unit"
                formControlName="weight_unit"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          <!-- Fitness Level -->
          <div>
            <label for="fitness_level" class="block text-sm font-medium text-gray-700"> Fitness Level * </label>
            <select
              id="fitness_level"
              formControlName="fitness_level"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            >
              <option [value]="1">1 - Beginner (little to no experience)</option>
              <option [value]="2">2 - Novice (some experience)</option>
              <option [value]="3">3 - Intermediate (regular training)</option>
              <option [value]="4">4 - Advanced (experienced lifter)</option>
              <option [value]="5">5 - Elite (competitive athlete)</option>
            </select>
          </div>

          <!-- Physical Limitations (Optional) -->
          <div>
            <label for="physical_limitations" class="block text-sm font-medium text-gray-700">
              Physical Limitations <span class="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="physical_limitations"
              formControlName="physical_limitations"
              rows="3"
              placeholder="Describe any injuries, limitations, or accommodations needed"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">Leave blank if you have no physical limitations</p>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button
              type="submit"
              [disabled]="isSaving() || profileForm.invalid"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving() ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
  host: {
    class: 'flex-1 w-full max-w-4xl mx-auto py-8 px-4',
  },
  styles: [],
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  readonly userProfileService = inject(UserProfileService);
  private readonly router = inject(Router);

  readonly profileForm = this.fb.group({
    age: this.fb.control<number>(0, {
      validators: [Validators.required, Validators.min(1), Validators.max(120)],
      nonNullable: true,
    }),
    weight: this.fb.control<number>(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    weight_unit: this.fb.control<'lbs' | 'kg'>('lbs', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    fitness_level: this.fb.control<number>(3, {
      validators: [Validators.required, Validators.min(1), Validators.max(5)],
      nonNullable: true,
    }),
    physical_limitations: this.fb.control<string>(''), // Optional, no validators
  });

  isSaving = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    // Reactively populate form when profile signal changes
    // This handles both initial load and any updates to the profile
    effect(() => {
      const profile = this.userProfileService.profile();
      if (profile) {
        this.profileForm.patchValue({
          age: profile.age,
          weight: profile.weight,
          weight_unit: profile.weight_unit,
          fitness_level: profile.fitness_level,
          physical_limitations: profile.physical_limitations ?? '',
        });
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    try {
      const formValue = this.profileForm.getRawValue();
      const profile: UserProfile = {
        age: formValue.age,
        weight: formValue.weight,
        weight_unit: formValue.weight_unit,
        fitness_level: Number(formValue.fitness_level),
        physical_limitations: formValue.physical_limitations || undefined,
      };

      await this.userProfileService.saveProfile(profile);
      this.successMessage.set('Profile saved successfully!');
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.error.set(anyErr.message || 'Failed to save profile');
    } finally {
      this.isSaving.set(false);
    }
  }

  getFieldError(fieldName: string): string | null {
    const control = this.profileForm.get(fieldName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['min']) {
        return `Minimum value is ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `Maximum value is ${control.errors['max'].max}`;
      }
    }
    return null;
  }
}
