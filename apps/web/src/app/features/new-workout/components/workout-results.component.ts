import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WorkoutOutput, HypertrophyOutput, StrengthOutput, ConditioningOutput } from '@trkn-shared';
import { ExerciseCardComponent } from './exercise-card.component';
import { IntervalCardComponent } from './interval-card.component';

@Component({
  selector: 'app-workout-results',
  standalone: true,
  imports: [CommonModule, ExerciseCardComponent, IntervalCardComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-3xl font-bold">{{ formatWorkoutType(workout().workout_type) }} Workout</h2>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {{ getDifficultyLabel(workout().difficulty_rating) }}
          </span>
        </div>
        <p class="text-gray-600">Total Duration: {{ workout().total_duration_minutes }} minutes</p>
      </div>

      <!-- Conflicting Parameters Warning -->
      @if (workout().conflicting_parameters) {
        <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 class="text-sm font-semibold text-yellow-800 mb-1">⚠️ Parameter Adjustments</h3>
          <p class="text-sm text-yellow-700">{{ workout().conflicting_parameters }}</p>
        </div>
      }

      <!-- Warmup -->
      @if (workout().warmup && workout().warmup.length > 0) {
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-3">Warmup</h3>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <ul class="list-disc list-inside space-y-1">
              @for (item of workout().warmup; track $index) {
                <li class="text-sm text-gray-700">{{ item }}</li>
              }
            </ul>
          </div>
        </div>
      }

      <!-- Main Workout Content -->
      @switch (workout().workout_type) {
        @case ('hypertrophy') {
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-3">Exercises</h3>
            <div class="space-y-4">
              @for (exercise of getHypertrophyWorkout().exercises; track $index) {
                <app-exercise-card [exercise]="exercise" />
              }
            </div>

            <!-- Hypertrophy-specific metadata -->
            @if (getHypertrophyWorkout().estimated_volume) {
              <div class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Estimated Volume:</span> {{ getHypertrophyWorkout().estimated_volume }}
                </p>
              </div>
            }
          </div>
        }
        @case ('strength') {
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-3">Exercises</h3>
            <div class="flex flex-col gap-4">
              @for (exercise of getStrengthWorkout().exercises; track $index) {
                <app-exercise-card [exercise]="exercise" />
              }
            </div>

            <!-- Strength-specific metadata -->
            @if (getStrengthWorkout().estimated_intensity) {
              <div class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Estimated Intensity:</span> {{ getStrengthWorkout().estimated_intensity }}
                </p>
              </div>
            }
          </div>
        }
        @case ('conditioning') {
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-3">Intervals</h3>
            <div class="space-y-4">
              @for (interval of getConditioningWorkout().intervals; track interval.interval_number) {
                <app-interval-card [interval]="interval" />
              }
            </div>

            <!-- Conditioning-specific metadata -->
            @if (getConditioningWorkout().estimated_calories) {
              <div class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Estimated Calories:</span> ~{{
                    getConditioningWorkout().estimated_calories
                  }}
                  kcal
                </p>
              </div>
            }
          </div>
        }
      }

      <!-- Cooldown -->
      @if (workout().cooldown && workout().cooldown.length > 0) {
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-3">Cooldown</h3>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <ul class="list-disc list-inside space-y-1">
              @for (item of workout().cooldown; track $index) {
                <li class="text-sm text-gray-700">{{ item }}</li>
              }
            </ul>
          </div>
        </div>
      }

      <!-- General Notes -->
      @if (workout().general_notes) {
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-3">General Notes</h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-gray-700 whitespace-pre-line">{{ workout().general_notes }}</p>
          </div>
        </div>
      }

      <!-- Actions -->
      <div class="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          (click)="onBackToEdit()"
          class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Modify Parameters
        </button>
        <button
          type="button"
          (click)="onStartOver()"
          class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Start Over
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class WorkoutResultsComponent {
  workout = input.required<WorkoutOutput>();

  backToEdit = output<void>();
  startOver = output<void>();

  formatWorkoutType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  getDifficultyLabel(rating: number): string {
    const labels = ['', 'Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'];
    return labels[rating] || 'Unknown';
  }

  getHypertrophyWorkout(): HypertrophyOutput {
    return this.workout() as HypertrophyOutput;
  }

  getStrengthWorkout(): StrengthOutput {
    return this.workout() as StrengthOutput;
  }

  getConditioningWorkout(): ConditioningOutput {
    return this.workout() as ConditioningOutput;
  }

  onBackToEdit(): void {
    this.backToEdit.emit();
  }

  onStartOver(): void {
    this.startOver.emit();
  }
}
