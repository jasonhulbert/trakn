import { Component, input, output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { WorkoutInput } from '@trkn-shared';
import {
  UiButtonDirective,
  UiDescriptionDirective,
  UiErrorDirective,
  UiFormFieldDirective,
  UiInputDirective,
  UiLabelDirective,
  UiSelectDirective,
  UiTextareaDirective,
} from 'src/app/shared/components';

type WorkoutType = 'hypertrophy' | 'strength' | 'conditioning';

@Component({
  selector: 'app-workout-params-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiButtonDirective,
    UiFormFieldDirective,
    UiLabelDirective,
    UiDescriptionDirective,
    UiErrorDirective,
    UiInputDirective,
    UiSelectDirective,
    UiTextareaDirective,
  ],
  template: `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Workout Parameters</h2>

      <form [formGroup]="paramsForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Workout Duration -->
        <div uiFormField>
          <label uiLabel for="duration">Workout Duration (minutes)</label>
          <input uiInput id="duration" type="number" formControlName="workout_duration" min="10" max="180" />
          @if (paramsForm.get('workout_duration')?.invalid && paramsForm.get('workout_duration')?.touched) {
            <p uiError>Please enter a duration between 10 and 180 minutes</p>
          }
        </div>

        <!-- Hypertrophy-specific fields -->
        @if (workoutType() === 'hypertrophy') {
          <div uiFormField>
            <label uiLabel for="muscle-group">Target Muscle Group</label>
            <select uiSelect id="muscle-group" formControlName="target_muscle_group">
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
              <span class="text-sm font-medium text-fore-300">Emphasize controlled tempo</span>
            </label>
            <p class="mt-1 text-sm text-fore-600">Focus on slow, controlled movements for muscle tension</p>
          </div>

          <div uiFormField>
            <label uiLabel for="progression">Weight Progression Pattern</label>
            <select uiSelect id="progression" formControlName="weight_progression_pattern">
              <option value="">Select a pattern</option>
              <option value="pyramid">Pyramid (increase weight each set)</option>
              <option value="reverse_pyramid">Reverse Pyramid (decrease weight each set)</option>
              <option value="straight_sets">Straight Sets (same weight all sets)</option>
              <option value="wave_loading">Wave Loading (undulating weight)</option>
            </select>
          </div>

          <div uiFormField>
            <label uiLabel for="equipment">Equipment Access</label>
            <select uiSelect id="equipment" formControlName="equipment_access">
              <option value="">Select equipment access</option>
              <option value="full_gym">Full Gym</option>
              <option value="limited_equipment">Limited Equipment</option>
              <option value="bodyweight_only">Bodyweight Only</option>
            </select>
          </div>
        }

        <!-- Strength-specific fields -->
        @if (workoutType() === 'strength') {
          <div uiFormField>
            <label uiLabel for="muscle-group">Target Muscle Group</label>
            <select uiSelect id="muscle-group" formControlName="target_muscle_group">
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

          <div uiFormField>
            <label uiLabel for="load">Target Load Percentage (% of estimated max)</label>
            <input uiInput id="load" type="number" formControlName="load_percentage" min="1" max="100" />
            <p uiDescription>Example: 75 for 75% of your max</p>
            @if (paramsForm.get('load_percentage')?.invalid && paramsForm.get('load_percentage')?.touched) {
              <p uiError>Please enter a percentage between 1 and 100</p>
            }
          </div>

          <div uiFormField>
            <label uiLabel for="progression">Weight Progression Pattern</label>
            <select uiSelect id="progression" formControlName="weight_progression_pattern">
              <option value="">Select a pattern</option>
              <option value="pyramid">Pyramid (increase weight each set)</option>
              <option value="reverse_pyramid">Reverse Pyramid (decrease weight each set)</option>
              <option value="straight_sets">Straight Sets (same weight all sets)</option>
              <option value="wave_loading">Wave Loading (undulating weight)</option>
            </select>
          </div>

          <div uiFormField>
            <label uiLabel for="equipment">Equipment Access</label>
            <select uiSelect id="equipment" formControlName="equipment_access">
              <option value="">Select equipment access</option>
              <option value="full_gym">Full Gym</option>
              <option value="limited_equipment">Limited Equipment</option>
              <option value="bodyweight_only">Bodyweight Only</option>
            </select>
          </div>
        }

        <!-- Conditioning-specific fields -->
        @if (workoutType() === 'conditioning') {
          <div uiFormField>
            <label uiLabel for="interval-structure">Interval Structure</label>
            <select uiSelect id="interval-structure" formControlName="interval_structure">
              <option value="">Select an interval structure</option>
              <option value="hiit">HIIT (High-Intensity Interval Training)</option>
              <option value="steady_state">Steady State</option>
              <option value="mixed">Mixed</option>
              <option value="tabata">Tabata</option>
              <option value="emom">EMOM (Every Minute On the Minute)</option>
            </select>
          </div>

          <div uiFormField>
            <label uiLabel for="modality">Cardio Modality</label>
            <select uiSelect id="modality" formControlName="cardio_modality">
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

          <div uiFormField>
            <label uiLabel for="distance-time">Distance/Time Goal (optional)</label>
            <input
              uiInput
              id="distance-time"
              type="text"
              formControlName="distance_time_goal"
              placeholder="e.g., 5k, 30 minutes"
            />
            <p uiDescription>Optional: Specify a distance or time goal</p>
          </div>

          <div uiFormField>
            <label uiLabel for="equipment">Equipment Access</label>
            <select uiSelect id="equipment" formControlName="equipment_access">
              <option value="">Select equipment access</option>
              <option value="cardio_machines">Cardio Machines</option>
              <option value="outdoor_space">Outdoor Space</option>
              <option value="minimal_space">Minimal Space</option>
              <option value="pool_access">Pool Access</option>
            </select>
          </div>
        }

        <!-- Equipment Notes (common to all types) -->
        <div uiFormField>
          <label uiLabel for="equipment-notes">Equipment Notes (optional)</label>
          <textarea
            uiTextarea
            id="equipment-notes"
            formControlName="equipment_notes"
            rows="3"
            placeholder="Any specific equipment you have or don't have access to"
          ></textarea>
        </div>

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="p-4 bg-danger-500/10 border border-danger-500/20 rounded-md">
            <p class="text-sm text-danger-400">{{ errorMessage() }}</p>
          </div>
        }

        <!-- Form Actions -->
        <div class="flex justify-between pt-4">
          <button type="button" uiButton (click)="onBack()">Back</button>
          <button type="submit" uiButton [disabled]="paramsForm.invalid || isSubmitting()">
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
