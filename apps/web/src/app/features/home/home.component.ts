import { Component, inject, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { UserProfileService } from '../../core/services/user-profile.service';
import { WorkoutService } from '../../core/services/workout.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="text-center mb-8">
      <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Welcome to Trakn</h2>
    </div>

    @if (!userProfileService.hasProfile()) {
      <!-- Complete Profile CTA -->
      <div class="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-yellow-900 mb-2">Complete Your Profile</h3>
        <p class="text-sm text-yellow-700 mb-4">Tell us about yourself to get personalized workout recommendations.</p>
        <a
          routerLink="/profile"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-900 bg-yellow-100 hover:bg-yellow-200"
        >
          Set Up Profile
        </a>
      </div>
    } @else {
      <!-- Actions -->
      <div class="flex justify-center gap-4 mb-8">
        <a
          routerLink="/workouts/new"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Workout
        </a>
        <a
          routerLink="/workouts"
          class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Manage Workouts
        </a>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">Recent Workouts</h3>
          @if (recentWorkouts().length > 0) {
            <a routerLink="/workouts" class="text-xs text-indigo-600 hover:text-indigo-800">View All</a>
          }
        </div>
        <div class="divide-y divide-gray-100">
          @if (workoutService.isLoadingWorkouts()) {
            <div class="flex justify-center py-6">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          } @else if (recentWorkouts().length === 0) {
            <div class="text-center py-6">
              <p class="text-sm text-gray-400">No workouts yet</p>
            </div>
          } @else {
            @for (workout of recentWorkouts(); track workout.id) {
              <a
                [routerLink]="['/workouts', workout.id]"
                class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    [class.bg-purple-100]="workout.workout_type === 'hypertrophy'"
                    [class.text-purple-800]="workout.workout_type === 'hypertrophy'"
                    [class.bg-red-100]="workout.workout_type === 'strength'"
                    [class.text-red-800]="workout.workout_type === 'strength'"
                    [class.bg-green-100]="workout.workout_type === 'conditioning'"
                    [class.text-green-800]="workout.workout_type === 'conditioning'"
                  >
                    {{ formatWorkoutType(workout.workout_type) }}
                  </span>
                  <span class="text-sm text-gray-600">{{ workout.data.total_duration_minutes }} min</span>
                </div>
                <span class="text-xs text-gray-400">{{ workout.created_at | date: 'MMM d' }}</span>
              </a>
            }
          }
        </div>
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
export class HomeComponent {
  readonly userProfileService = inject(UserProfileService);
  readonly workoutService = inject(WorkoutService);

  readonly recentWorkouts = computed(() => this.workoutService.workouts().slice(0, 5));

  constructor() {
    effect(() => {
      if (this.userProfileService.hasProfile()) {
        this.workoutService.loadWorkouts();
      }
    });
  }

  formatWorkoutType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
