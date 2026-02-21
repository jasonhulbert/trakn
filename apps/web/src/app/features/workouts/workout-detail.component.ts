import { Component, inject, computed, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkoutService } from '../../core/services/workout.service';
import { AuthService } from '../../core/services/auth.service';
import { WorkoutEditorComponent } from '../../shared/components/workout-editor/workout-editor.component';
import type { WorkoutOutput } from '@trkn-shared';

@Component({
  selector: 'app-workout-detail',
  standalone: true,
  imports: [RouterLink, WorkoutEditorComponent],
  template: `
    <div class="w-full max-w-2xl mx-auto py-8 px-4">
      @if (workoutService.isLoadingWorkouts()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (!workout()) {
        <div class="text-center py-12">
          <p class="text-gray-500 mb-4">Workout not found.</p>
          <a routerLink="/workouts" class="text-indigo-600 hover:text-indigo-800">Back to Workouts</a>
        </div>
      } @else {
        <div class="flex items-center justify-between mb-6">
          <a routerLink="/workouts" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Workouts</a>
          <div class="flex items-center gap-3">
            @if (!isEditing()) {
              <button
                type="button"
                (click)="isEditing.set(true)"
                class="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50"
              >
                Edit Workout
              </button>
            } @else {
              <button
                type="button"
                (click)="cancelEditing()"
                class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            }
            <button
              type="button"
              (click)="onDelete()"
              [disabled]="workoutService.isDeleting()"
              class="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <app-workout-editor
            [workout]="workout()!"
            [editable]="isEditing()"
            [isRevising]="workoutService.isRevising()"
            [revisingExerciseIndex]="workoutService.revisingExerciseIndex()"
            [revisingIntervalIndex]="workoutService.revisingIntervalIndex()"
            [error]="error()"
            (workoutRevisionRequested)="onWorkoutRevisionRequested($event)"
            (exerciseRevisionRequested)="onExerciseRevisionRequested($event)"
            (intervalRevisionRequested)="onIntervalRevisionRequested($event)"
            (workoutChanged)="onWorkoutChanged($event)"
          />

          @if (isEditing()) {
            <div class="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                (click)="onSave()"
                [disabled]="workoutService.isSaving()"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                @if (workoutService.isSaving()) {
                  <span
                    class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></span>
                  Saving...
                } @else {
                  Save Changes
                }
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `,
})
export class WorkoutDetailComponent {
  readonly workoutService = inject(WorkoutService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly isEditing = signal(false);
  readonly error = signal<string | null>(null);

  private editedWorkout = signal<WorkoutOutput | null>(null);

  readonly workout = computed(() => {
    return this.editedWorkout() ?? this.workoutService.currentWorkout()?.data ?? null;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      effect(() => {
        if (this.auth.currentUser()) {
          this.workoutService.loadWorkout(id);
        }
      });
    }
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.editedWorkout.set(null);
    this.error.set(null);
  }

  onWorkoutChanged(workout: WorkoutOutput): void {
    this.editedWorkout.set(workout);
  }

  async onSave(): Promise<void> {
    const row = this.workoutService.currentWorkout();
    const data = this.editedWorkout();
    if (!row || !data) return;

    this.error.set(null);

    try {
      await this.workoutService.updateSavedWorkout(row.id, data);
      this.editedWorkout.set(null);
      this.isEditing.set(false);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to save changes');
    }
  }

  async onWorkoutRevisionRequested(revisionText: string): Promise<void> {
    const currentWorkout = this.workout();
    if (!currentWorkout) return;

    this.error.set(null);

    try {
      const revised = await this.workoutService.reviseSavedWorkout(currentWorkout, revisionText);
      this.editedWorkout.set(revised);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to revise workout');
    }
  }

  async onExerciseRevisionRequested(event: { index: number; text: string }): Promise<void> {
    const currentWorkout = this.workout();
    if (!currentWorkout) return;

    this.error.set(null);

    try {
      const revised = await this.workoutService.reviseSavedExercise(currentWorkout, event.index, event.text);
      this.editedWorkout.set(revised);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to revise exercise');
    }
  }

  async onIntervalRevisionRequested(event: { index: number; text: string }): Promise<void> {
    const currentWorkout = this.workout();
    if (!currentWorkout) return;

    this.error.set(null);

    try {
      const revised = await this.workoutService.reviseSavedInterval(currentWorkout, event.index, event.text);
      this.editedWorkout.set(revised);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to revise interval');
    }
  }

  async onDelete(): Promise<void> {
    const row = this.workoutService.currentWorkout();
    if (!row) return;
    if (!confirm(`Delete this ${row.workout_type} workout?`)) return;

    await this.workoutService.deleteWorkout(row.id);
    this.router.navigate(['/workouts']);
  }
}
