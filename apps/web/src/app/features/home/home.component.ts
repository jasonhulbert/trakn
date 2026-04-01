import { Component, inject, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { UserProfileService } from '../../core/services/user-profile.service';
import { WorkoutService } from '../../core/services/workout.service';
import { UiButtonDirective, UiCardComponent, UiCardHeaderDirective } from 'src/app/shared/components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe, UiButtonDirective, UiCardComponent, UiCardHeaderDirective],
  template: `
    <div class="text-center mb-8">
      <h2 class="text-3xl font-extrabold text-fore-300 sm:text-4xl">Welcome to Trakn</h2>
    </div>

    @if (!userProfileService.hasProfile()) {
      <!-- Complete Profile CTA -->
      <div class="max-w-md mx-auto bg-accent-500/10 border border-accent-500/20 rounded-lg p-6">
        <h3 class="text-lg font-medium text-accent-400 mb-2">Complete Your Profile</h3>
        <p class="text-sm text-fore-500 mb-4">Tell us about yourself to get personalized workout recommendations.</p>
        <a routerLink="/profile" uiButton>Set Up Profile</a>
      </div>
    } @else {
      <!-- Actions -->
      <div class="flex justify-center gap-4 mb-8">
        <a routerLink="/workouts/new" uiButton>Create New Workout</a>
        <a routerLink="/workouts" uiButton>Manage Workouts</a>
      </div>

      <ui-card [variant]="'elevated'" [padding]="'none'">
        <div uiCardHeader>
          <h3 class="text-sm font-semibold text-fore-300">Recent Workouts</h3>
          @if (recentWorkouts().length > 0) {
            <a routerLink="/workouts" class="text-xs text-accent-500 hover:text-accent-400">View All</a>
          }
        </div>
        <div class="divide-y divide-base-700">
          @if (workoutService.isLoadingWorkouts()) {
            <div class="flex justify-center py-6">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500"></div>
            </div>
          } @else if (recentWorkouts().length === 0) {
            <div class="text-center py-6">
              <p class="text-sm text-fore-700">No workouts yet</p>
            </div>
          } @else {
            @for (workout of recentWorkouts(); track workout.id) {
              <a
                [routerLink]="['/workouts', workout.id]"
                class="flex items-center justify-between px-4 py-3 hover:bg-base-800 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-base-700 text-fore-300">
                    {{ formatWorkoutType(workout.workout_type) }}
                  </span>
                  <span class="text-sm text-fore-500">{{ workout.data.total_duration_minutes }} min</span>
                </div>
                <span class="text-xs text-fore-700">{{ workout.created_at | date: 'MMM d' }}</span>
              </a>
            }
          }
        </div>
      </ui-card>
    }
  `,
  host: {
    class: 'flex-1 w-full max-w-4xl mx-auto py-8 px-4',
  },
  styles: [],
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
