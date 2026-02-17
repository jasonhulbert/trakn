import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  WorkoutOutput,
  HypertrophyOutput,
  StrengthOutput,
  ConditioningOutput,
  Exercise,
  Interval,
} from '@trkn-shared';
import { ExerciseCardComponent } from '../../../features/new-workout/components/exercise-card.component';
import { IntervalCardComponent } from '../../../features/new-workout/components/interval-card.component';
import { RevisionInputComponent } from '../../../features/new-workout/components/revision-input.component';

@Component({
  selector: 'app-workout-editor',
  standalone: true,
  imports: [FormsModule, ExerciseCardComponent, IntervalCardComponent, RevisionInputComponent],
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
          <h3 class="text-sm font-semibold text-yellow-800 mb-1">Parameter Adjustments</h3>
          <p class="text-sm text-yellow-700">{{ workout().conflicting_parameters }}</p>
        </div>
      }

      <!-- Workout-Level Revision -->
      @if (editable()) {
        <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Revise Entire Workout</h3>
          <app-revision-input
            label="Describe changes to the whole workout..."
            placeholder="e.g. 'Make it shorter' or 'Add more core work' or 'Reduce rest times'"
            [isLoading]="isRevising()"
            (submitted)="onWorkoutRevisionSubmitted($event)"
          />
        </div>
      }

      <!-- Warmup -->
      @if (workout().warmup && workout().warmup.length > 0) {
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xl font-semibold">Warmup</h3>
            @if (editable()) {
              <button
                type="button"
                (click)="toggleWarmupEdit()"
                class="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
              >
                {{ isEditingWarmup() ? 'Done' : 'Edit' }}
              </button>
            }
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            @if (isEditingWarmup()) {
              @for (item of editWarmup; track $index) {
                <div class="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    [ngModel]="editWarmup[$index]"
                    (ngModelChange)="updateWarmupItem($index, $event)"
                    class="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    (click)="removeWarmupItem($index)"
                    class="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    Remove
                  </button>
                </div>
              }
              <button type="button" (click)="addWarmupItem()" class="text-sm text-blue-600 hover:text-blue-800 mt-1">
                + Add item
              </button>
            } @else {
              <ul class="list-disc list-inside space-y-1">
                @for (item of workout().warmup; track $index) {
                  <li class="text-sm text-gray-700">{{ item }}</li>
                }
              </ul>
            }
          </div>
        </div>
      }

      <!-- Main Workout Content -->
      @switch (workout().workout_type) {
        @case ('hypertrophy') {
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-3">Exercises</h3>
            <div class="flex flex-col gap-4">
              @for (exercise of getHypertrophyWorkout().exercises; track $index) {
                <app-exercise-card
                  [exercise]="exercise"
                  [exerciseIndex]="$index"
                  [isRevising]="isRevising() && revisingExerciseIndex() === $index"
                  (exerciseChanged)="onExerciseChanged($index, $event)"
                  (revisionRequested)="onExerciseRevisionRequested($event)"
                />
              }
            </div>

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
                <app-exercise-card
                  [exercise]="exercise"
                  [exerciseIndex]="$index"
                  [isRevising]="isRevising() && revisingExerciseIndex() === $index"
                  (exerciseChanged)="onExerciseChanged($index, $event)"
                  (revisionRequested)="onExerciseRevisionRequested($event)"
                />
              }
            </div>

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
            <div class="flex flex-col gap-4">
              @for (interval of getConditioningWorkout().intervals; track interval.interval_number) {
                <app-interval-card
                  [interval]="interval"
                  [intervalIndex]="$index"
                  [isRevising]="isRevising() && revisingIntervalIndex() === $index"
                  (intervalChanged)="onIntervalChanged($index, $event)"
                  (revisionRequested)="onIntervalRevisionRequested($event)"
                />
              }
            </div>

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
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xl font-semibold">Cooldown</h3>
            @if (editable()) {
              <button
                type="button"
                (click)="toggleCooldownEdit()"
                class="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
              >
                {{ isEditingCooldown() ? 'Done' : 'Edit' }}
              </button>
            }
          </div>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            @if (isEditingCooldown()) {
              @for (item of editCooldown; track $index) {
                <div class="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    [ngModel]="editCooldown[$index]"
                    (ngModelChange)="updateCooldownItem($index, $event)"
                    class="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    (click)="removeCooldownItem($index)"
                    class="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    Remove
                  </button>
                </div>
              }
              <button type="button" (click)="addCooldownItem()" class="text-sm text-blue-600 hover:text-blue-800 mt-1">
                + Add item
              </button>
            } @else {
              <ul class="list-disc list-inside space-y-1">
                @for (item of workout().cooldown; track $index) {
                  <li class="text-sm text-gray-700">{{ item }}</li>
                }
              </ul>
            }
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

      <!-- Error Display -->
      @if (error()) {
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ error() }}</p>
        </div>
      }
    </div>
  `,
})
export class WorkoutEditorComponent {
  workout = input.required<WorkoutOutput>();
  editable = input<boolean>(false);
  isRevising = input<boolean>(false);
  revisingExerciseIndex = input<number | null>(null);
  revisingIntervalIndex = input<number | null>(null);
  error = input<string | null>(null);

  workoutRevisionRequested = output<string>();
  exerciseRevisionRequested = output<{ index: number; text: string }>();
  intervalRevisionRequested = output<{ index: number; text: string }>();
  workoutChanged = output<WorkoutOutput>();

  // Warmup/cooldown edit state
  isEditingWarmup = signal(false);
  isEditingCooldown = signal(false);
  editWarmup: string[] = [];
  editCooldown: string[] = [];

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

  // Warmup editing
  toggleWarmupEdit(): void {
    if (this.isEditingWarmup()) {
      this.applyWarmupEdits();
    } else {
      this.editWarmup = [...this.workout().warmup];
    }
    this.isEditingWarmup.set(!this.isEditingWarmup());
  }

  updateWarmupItem(index: number, value: string): void {
    this.editWarmup[index] = value;
  }

  removeWarmupItem(index: number): void {
    this.editWarmup.splice(index, 1);
    this.applyWarmupEdits();
  }

  addWarmupItem(): void {
    this.editWarmup.push('');
  }

  private applyWarmupEdits(): void {
    const filtered = this.editWarmup.filter((item) => item.trim().length > 0);
    const updated = { ...this.workout(), warmup: filtered };
    this.workoutChanged.emit(updated as WorkoutOutput);
  }

  // Cooldown editing
  toggleCooldownEdit(): void {
    if (this.isEditingCooldown()) {
      this.applyCooldownEdits();
    } else {
      this.editCooldown = [...this.workout().cooldown];
    }
    this.isEditingCooldown.set(!this.isEditingCooldown());
  }

  updateCooldownItem(index: number, value: string): void {
    this.editCooldown[index] = value;
  }

  removeCooldownItem(index: number): void {
    this.editCooldown.splice(index, 1);
    this.applyCooldownEdits();
  }

  addCooldownItem(): void {
    this.editCooldown.push('');
  }

  private applyCooldownEdits(): void {
    const filtered = this.editCooldown.filter((item) => item.trim().length > 0);
    const updated = { ...this.workout(), cooldown: filtered };
    this.workoutChanged.emit(updated as WorkoutOutput);
  }

  // Exercise editing (manual)
  onExerciseChanged(index: number, exercise: Exercise): void {
    const w = this.workout();
    if (w.workout_type === 'conditioning') return;

    const exercises = [...w.exercises];
    exercises[index] = exercise;
    const updated = { ...w, exercises };
    this.workoutChanged.emit(updated as WorkoutOutput);
  }

  // Interval editing (manual)
  onIntervalChanged(index: number, interval: Interval): void {
    const w = this.workout();
    if (w.workout_type !== 'conditioning') return;

    const intervals = [...(w as ConditioningOutput).intervals];
    intervals[index] = interval;
    const updated = { ...w, intervals };
    this.workoutChanged.emit(updated as WorkoutOutput);
  }

  // AI revision
  onWorkoutRevisionSubmitted(text: string): void {
    this.workoutRevisionRequested.emit(text);
  }

  onExerciseRevisionRequested(event: { index: number; text: string }): void {
    this.exerciseRevisionRequested.emit(event);
  }

  onIntervalRevisionRequested(event: { index: number; text: string }): void {
    this.intervalRevisionRequested.emit(event);
  }
}
