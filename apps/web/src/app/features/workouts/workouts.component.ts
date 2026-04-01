import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../../core/services/workout.service';
import { AuthService } from '../../core/services/auth.service';
import type { WorkoutRow } from '../../core/db/indexed-db.service';
import { UiButtonDirective, UiCardComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [RouterLink, DatePipe, UiButtonDirective, UiCardComponent],
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <a routerLink="/" class="text-sm text-fore-600 hover:text-fore-300 mb-1 inline-block">&larr; Back to Home</a>
        <h2 class="text-2xl font-bold text-fore-300">My Workouts</h2>
      </div>
      <a routerLink="/workouts/new" uiButton>Create New Workout</a>
    </div>

    @if (workoutService.isLoadingWorkouts()) {
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    } @else if (workoutService.workouts().length === 0) {
      <div class="text-center py-12 bg-base-800 rounded-lg border border-base-700">
        <p class="text-fore-600 mb-4">No workouts yet — create your first!</p>
        <a routerLink="/workouts/new" uiButton>Create New Workout</a>
      </div>
    } @else {
      <!-- Workout List -->
      <div class="flex flex-col gap-3">
        @for (workout of workoutService.workouts(); track workout.id) {
          <ui-card class="flex items-center justify-between">
            <a [routerLink]="['/workouts', workout.id]" class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-base-700 text-fore-300">
                  {{ formatWorkoutType(workout.workout_type) }}
                </span>
                <span class="text-sm text-fore-600">{{ workout.created_at | date: 'MMM d, y' }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-fore-500">
                <span>{{ workout.data.total_duration_minutes }} min</span>
                <span>{{ getDifficultyLabel(workout.data.difficulty_rating) }}</span>
                @if (workout.workout_type !== 'conditioning' && $any(workout.data).target_muscle_group) {
                  <span class="capitalize">{{ formatMuscleGroup($any(workout.data).target_muscle_group) }}</span>
                }
                @if (workout.workout_type === 'conditioning' && $any(workout.data).cardio_modality) {
                  <span class="capitalize">{{ formatModality($any(workout.data).cardio_modality) }}</span>
                }
              </div>
            </a>
            <button
              type="button"
              uiButton
              (click)="onDelete(workout, $event)"
              [disabled]="workoutService.isDeleting()"
              class="ml-4"
            >
              Delete
            </button>
          </ui-card>
        }
      </div>
    }
  `,
  host: {
    class: 'flex-1 w-full max-w-4xl mx-auto py-8 px-4',
  },
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
export class WorkoutsComponent {
  readonly workoutService = inject(WorkoutService);
  private readonly auth = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.auth.currentUser()) {
        this.workoutService.loadWorkouts();
      }
    });
  }

  formatWorkoutType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  getDifficultyLabel(rating: number): string {
    const labels = ['', 'Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'];
    return labels[rating] || 'Unknown';
  }

  formatMuscleGroup(group: string): string {
    return group.replace(/_/g, ' ');
  }

  formatModality(modality: string): string {
    return modality.replace(/_/g, ' ');
  }

  async onDelete(workout: WorkoutRow, event: Event): Promise<void> {
    event.stopPropagation();
    if (!confirm(`Delete this ${workout.workout_type} workout?`)) return;
    await this.workoutService.deleteWorkout(workout.id);
  }
}
