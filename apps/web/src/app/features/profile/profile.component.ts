import { Component, inject, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import type { UserProfile } from '@trkn-shared';
import { UserProfileService } from '../../core/services/user-profile.service';
import {
  UiButtonDirective,
  UiDescriptionDirective,
  UiErrorDirective,
  UiFormFieldDirective,
  UiInputDirective,
  UiLabelDirective,
  UiSelectDirective,
  UiTextareaDirective,
  UiToastService,
  UiCardComponent,
  UiCardHeaderDirective,
  UiCardBodyDirective,
} from 'src/app/shared/components';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldDirective,
    UiLabelDirective,
    UiInputDirective,
    UiSelectDirective,
    UiTextareaDirective,
    UiDescriptionDirective,
    UiErrorDirective,
    UiButtonDirective,
    UiCardComponent,
    UiCardHeaderDirective,
    UiCardBodyDirective,
  ],
  template: `
    @if (userProfileService.isLoading()) {
      <div class="text-center">
        <p class="text-fore-500">Loading profile...</p>
      </div>
    } @else {
      <ui-card [variant]="'elevated'" [padding]="'none'">
        <div uiCardHeader>
          <h2 class="text-lg font-semibold">Profile</h2>
        </div>
        <div uiCardBody>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Age -->
            <div uiFormField>
              <label uiLabel for="age">Age *</label>
              <input
                uiInput
                id="age"
                formControlName="age"
                type="number"
                [class.border-danger-500]="profileForm.get('age')?.touched && profileForm.get('age')?.invalid"
              />
              @if (getFieldError('age')) {
                <p uiError>{{ getFieldError('age') }}</p>
              }
            </div>

            <!-- Weight + Unit -->
            <div class="grid grid-cols-2 gap-4">
              <div uiFormField>
                <label uiLabel for="weight">Weight *</label>
                <input
                  uiInput
                  id="weight"
                  formControlName="weight"
                  type="number"
                  step="0.1"
                  [class.border-danger-500]="profileForm.get('weight')?.touched && profileForm.get('weight')?.invalid"
                />
                @if (getFieldError('weight')) {
                  <p uiError>{{ getFieldError('weight') }}</p>
                }
              </div>
              <div uiFormField>
                <label uiLabel for="weight_unit">Unit *</label>
                <select uiSelect id="weight_unit" formControlName="weight_unit">
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <!-- Fitness Level -->
            <div uiFormField>
              <label uiLabel for="fitness_level">Fitness Level *</label>
              <select uiSelect id="fitness_level" formControlName="fitness_level">
                <option [value]="1">1 - Beginner (little to no experience)</option>
                <option [value]="2">2 - Novice (some experience)</option>
                <option [value]="3">3 - Intermediate (regular training)</option>
                <option [value]="4">4 - Advanced (experienced lifter)</option>
                <option [value]="5">5 - Elite (competitive athlete)</option>
              </select>
            </div>

            <!-- Physical Limitations (Optional) -->
            <div uiFormField>
              <label uiLabel for="physical_limitations">
                Physical Limitations <span class="text-fore-600 font-normal">(optional)</span>
              </label>
              <textarea
                uiTextarea
                id="physical_limitations"
                formControlName="physical_limitations"
                rows="3"
                placeholder="Describe any injuries, limitations, or accommodations needed"
              ></textarea>
              <p uiDescription>Leave blank if you have no physical limitations</p>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-3">
              <button type="submit" uiButton [disabled]="isSaving() || profileForm.invalid">
                {{ isSaving() ? 'Saving...' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </div>
      </ui-card>
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
  private readonly toast = inject(UiToastService);

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
      this.toast.success('Profile saved successfully!');
    } catch (err: unknown) {
      const anyErr = err as Error;
      this.toast.error(anyErr.message || 'Failed to save profile');
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
