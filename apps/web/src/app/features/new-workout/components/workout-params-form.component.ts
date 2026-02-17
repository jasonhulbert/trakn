import { Component, input, output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { WorkoutInput } from '@trkn-shared';

type WorkoutType = 'hypertrophy' | 'strength' | 'conditioning';

@Component({
  selector: 'app-workout-params-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Workout Parameters</h2>

      <form [formGroup]="paramsForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Workout Duration -->
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
            Workout Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            formControlName="workout_duration"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="10"
            max="180"
          />
          @if (paramsForm.get('workout_duration')?.invalid && paramsForm.get('workout_duration')?.touched) {
            <p class="mt-1 text-sm text-red-600">Please enter a duration between 10 and 180 minutes</p>
          }
        </div>

        <!-- Hypertrophy-specific fields -->
        @if (workoutType() === 'hypertrophy') {
          <div>
            <label for="muscle-group" class="block text-sm font-medium text-gray-700 mb-1"> Target Muscle Group </label>
            <select
              id="muscle-group"
              formControlName="target_muscle_group"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a muscle group</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="legs">Legs</option>
              <option value="core">Core</option>
              <option value="full_body">Full Body</option>
              <option value="upper_body">Upper Body</option>
              <option value="lower_body">Lower Body</option>
              <option value="push">Push</option>
              <option value="pull">Pull</option>
            </select>
          </div>

          <div>
            <label class="flex items-center space-x-2">
              <input type="checkbox" formControlName="tempo_focus" class="rounded" />
              <span class="text-sm font-medium text-gray-700">Emphasize controlled tempo</span>
            </label>
            <p class="mt-1 text-sm text-gray-500">Focus on slow, controlled movements for muscle tension</p>
          </div>

          <div>
            <label for="progression" class="block text-sm font-medium text-gray-700 mb-1">
              Weight Progression Pattern
            </label>
            <select
              id="progression"
              formControlName="weight_progression_pattern"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a pattern</option>
              <option value="pyramid">Pyramid (increase weight each set)</option>
              <option value="reverse_pyramid">Reverse Pyramid (decrease weight each set)</option>
              <option value="straight_sets">Straight Sets (same weight all sets)</option>
              <option value="wave_loading">Wave Loading (undulating weight)</option>
            </select>
          </div>

          <div>
            <label for="equipment" class="block text-sm font-medium text-gray-700 mb-1"> Equipment Access </label>
            <select
              id="equipment"
              formControlName="equipment_access"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select equipment access</option>
              <option value="full_gym">Full Gym</option>
              <option value="limited_equipment">Limited Equipment</option>
              <option value="bodyweight_only">Bodyweight Only</option>
            </select>
          </div>
        }

        <!-- Strength-specific fields -->
        @if (workoutType() === 'strength') {
          <div>
            <label for="muscle-group" class="block text-sm font-medium text-gray-700 mb-1"> Target Muscle Group </label>
            <select
              id="muscle-group"
              formControlName="target_muscle_group"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a muscle group</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="legs">Legs</option>
              <option value="core">Core</option>
              <option value="full_body">Full Body</option>
              <option value="upper_body">Upper Body</option>
              <option value="lower_body">Lower Body</option>
              <option value="push">Push</option>
              <option value="pull">Pull</option>
            </select>
          </div>

          <div>
            <label for="load" class="block text-sm font-medium text-gray-700 mb-1">
              Target Load Percentage (% of estimated max)
            </label>
            <input
              id="load"
              type="number"
              formControlName="load_percentage"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
            <p class="mt-1 text-sm text-gray-500">Example: 75 for 75% of your max</p>
            @if (paramsForm.get('load_percentage')?.invalid && paramsForm.get('load_percentage')?.touched) {
              <p class="mt-1 text-sm text-red-600">Please enter a percentage between 1 and 100</p>
            }
          </div>

          <div>
            <label for="progression" class="block text-sm font-medium text-gray-700 mb-1">
              Weight Progression Pattern
            </label>
            <select
              id="progression"
              formControlName="weight_progression_pattern"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a pattern</option>
              <option value="pyramid">Pyramid (increase weight each set)</option>
              <option value="reverse_pyramid">Reverse Pyramid (decrease weight each set)</option>
              <option value="straight_sets">Straight Sets (same weight all sets)</option>
              <option value="wave_loading">Wave Loading (undulating weight)</option>
            </select>
          </div>

          <div>
            <label for="equipment" class="block text-sm font-medium text-gray-700 mb-1"> Equipment Access </label>
            <select
              id="equipment"
              formControlName="equipment_access"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select equipment access</option>
              <option value="full_gym">Full Gym</option>
              <option value="limited_equipment">Limited Equipment</option>
              <option value="bodyweight_only">Bodyweight Only</option>
            </select>
          </div>
        }

        <!-- Conditioning-specific fields -->
        @if (workoutType() === 'conditioning') {
          <div>
            <label for="interval-structure" class="block text-sm font-medium text-gray-700 mb-1">
              Interval Structure
            </label>
            <select
              id="interval-structure"
              formControlName="interval_structure"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an interval structure</option>
              <option value="hiit">HIIT (High-Intensity Interval Training)</option>
              <option value="steady_state">Steady State</option>
              <option value="mixed">Mixed</option>
              <option value="tabata">Tabata</option>
              <option value="emom">EMOM (Every Minute On the Minute)</option>
            </select>
          </div>

          <div>
            <label for="modality" class="block text-sm font-medium text-gray-700 mb-1"> Cardio Modality </label>
            <select
              id="modality"
              formControlName="cardio_modality"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a cardio modality</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="rowing">Rowing</option>
              <option value="swimming">Swimming</option>
              <option value="jump_rope">Jump Rope</option>
              <option value="assault_bike">Assault Bike</option>
              <option value="elliptical">Elliptical</option>
              <option value="stair_climber">Stair Climber</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label for="distance-time" class="block text-sm font-medium text-gray-700 mb-1">
              Distance/Time Goal (optional)
            </label>
            <input
              id="distance-time"
              type="text"
              formControlName="distance_time_goal"
              placeholder="e.g., 5k, 30 minutes"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="mt-1 text-sm text-gray-500">Optional: Specify a distance or time goal</p>
          </div>

          <div>
            <label for="equipment" class="block text-sm font-medium text-gray-700 mb-1"> Equipment Access </label>
            <select
              id="equipment"
              formControlName="equipment_access"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select equipment access</option>
              <option value="cardio_machines">Cardio Machines</option>
              <option value="outdoor_space">Outdoor Space</option>
              <option value="minimal_space">Minimal Space</option>
              <option value="pool_access">Pool Access</option>
            </select>
          </div>
        }

        <!-- Equipment Notes (common to all types) -->
        <div>
          <label for="equipment-notes" class="block text-sm font-medium text-gray-700 mb-1">
            Equipment Notes (optional)
          </label>
          <textarea
            id="equipment-notes"
            formControlName="equipment_notes"
            rows="3"
            placeholder="Any specific equipment you have or don't have access to"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ errorMessage() }}</p>
          </div>
        }

        <!-- Form Actions -->
        <div class="flex justify-between pt-4">
          <button
            type="button"
            (click)="onBack()"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            [disabled]="paramsForm.invalid || isSubmitting()"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isSubmitting() ? 'Generating...' : 'Generate Workout' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class WorkoutParamsFormComponent {
  private readonly fb = inject(FormBuilder);

  workoutType = input.required<WorkoutType>();
  errorMessage = input<string | null>(null);
  isSubmitting = input<boolean>(false);

  paramsSubmitted = output<Partial<WorkoutInput>>();
  backClicked = output<void>();

  paramsForm = this.fb.group<Record<string, unknown>>({
    workout_duration: this.fb.control<number>(45, {
      validators: [Validators.required, Validators.min(10), Validators.max(180)],
      nonNullable: true,
    }),
    equipment_notes: this.fb.control<string>(''),
  });

  constructor() {
    effect(() => {
      this.workoutType(); // track the signal
      this.setupFormForWorkoutType();
    });
  }

  private setupFormForWorkoutType(): void {
    const type = this.workoutType();

    if (type === 'hypertrophy') {
      this.paramsForm.addControl(
        'target_muscle_group',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
      this.paramsForm.addControl('tempo_focus', this.fb.control<boolean>(false, { nonNullable: true }));
      this.paramsForm.addControl(
        'weight_progression_pattern',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
      this.paramsForm.addControl(
        'equipment_access',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
    } else if (type === 'strength') {
      this.paramsForm.addControl(
        'target_muscle_group',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
      this.paramsForm.addControl(
        'load_percentage',
        this.fb.control<number>(75, {
          validators: [Validators.required, Validators.min(1), Validators.max(100)],
          nonNullable: true,
        })
      );
      this.paramsForm.addControl(
        'weight_progression_pattern',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
      this.paramsForm.addControl(
        'equipment_access',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
    } else if (type === 'conditioning') {
      this.paramsForm.addControl(
        'interval_structure',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
      this.paramsForm.addControl(
        'cardio_modality',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
      this.paramsForm.addControl('distance_time_goal', this.fb.control<string>(''));
      this.paramsForm.addControl(
        'equipment_access',
        this.fb.control<string>('', { validators: [Validators.required], nonNullable: true })
      );
    }
  }

  onSubmit(): void {
    if (this.paramsForm.invalid) {
      this.paramsForm.markAllAsTouched();
      return;
    }

    const formValue = this.paramsForm.getRawValue();
    // Remove empty optional fields
    const params: Partial<WorkoutInput> = Object.fromEntries(
      Object.entries(formValue).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );

    this.paramsSubmitted.emit(params);
  }

  onBack(): void {
    this.backClicked.emit();
  }
}
