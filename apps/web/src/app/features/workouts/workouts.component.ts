import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../../core/services/workout.service';
import { AuthService } from '../../core/services/auth.service';
import { Header } from 'src/app/shared/components/header/header';
import type { WorkoutRow } from '../../core/db/indexed-db.service';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [RouterLink, DatePipe, Header],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>

      <div class="py-8 px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Page Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <a routerLink="/" class="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block"
                >&larr; Back to Home</a
              >
              <h2 class="text-2xl font-bold text-gray-900">My Workouts</h2>
            </div>
            <a
              routerLink="/workouts/new"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create New Workout
            </a>
          </div>

          <!-- Loading State -->
          @if (workoutService.isLoadingWorkouts()) {
            <div class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          } @else if (workoutService.workouts().length === 0) {
            <!-- Empty State -->
            <div class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <p class="text-gray-500 mb-4">No workouts yet — create your first!</p>
              <a
                routerLink="/workouts/new"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create New Workout
              </a>
            </div>
          } @else {
            <!-- Workout List -->
            <div class="flex flex-col gap-3">
              @for (workout of workoutService.workouts(); track workout.id) {
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <a [routerLink]="['/workouts', workout.id]" class="flex-1 min-w-0">
                      <div class="flex items-center gap-3 mb-1">
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full" [class]="getTypeBadgeClass(workout)">
                          {{ formatWorkoutType(workout.workout_type) }}
                        </span>
                        <span class="text-sm text-gray-500">{{ workout.created_at | date: 'MMM d, y' }}</span>
                      </div>
                      <div class="flex items-center gap-4 text-sm text-gray-600">
                        <span>{{ workout.data.total_duration_minutes }} min</span>
                        <span>{{ getDifficultyLabel(workout.data.difficulty_rating) }}</span>
                        @if (workout.workout_type !== 'conditioning' && $any(workout.data).target_muscle_group) {
                          <span class="capitalize">{{
                            formatMuscleGroup($any(workout.data).target_muscle_group)
                          }}</span>
                        }
                        @if (workout.workout_type === 'conditioning' && $any(workout.data).cardio_modality) {
                          <span class="capitalize">{{ formatModality($any(workout.data).cardio_modality) }}</span>
                        }
                      </div>
                    </a>
                    <button
                      type="button"
                      (click)="onDelete(workout, $event)"
                      [disabled]="workoutService.isDeleting()"
                      class="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
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

  getTypeBadgeClass(workout: WorkoutRow): string {
    switch (workout.workout_type) {
      case 'hypertrophy':
        return 'bg-purple-100 text-purple-800';
      case 'strength':
        return 'bg-red-100 text-red-800';
      case 'conditioning':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  async onDelete(workout: WorkoutRow, event: Event): Promise<void> {
    event.stopPropagation();
    if (!confirm(`Delete this ${workout.workout_type} workout?`)) return;
    await this.workoutService.deleteWorkout(workout.id);
  }
}
