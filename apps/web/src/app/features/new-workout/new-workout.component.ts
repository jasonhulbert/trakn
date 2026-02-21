import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService } from '../../core/services/workout.service';
import { WorkoutTypeSelectorComponent, WorkoutType } from './components/workout-type-selector.component';
import { WorkoutParamsFormComponent } from './components/workout-params-form.component';
import { WorkoutResultsComponent } from './components/workout-results.component';
import type { WorkoutInput, WorkoutOutput } from '@trkn-shared';

@Component({
  selector: 'app-new-workout',
  standalone: true,
  imports: [CommonModule, WorkoutTypeSelectorComponent, WorkoutParamsFormComponent, WorkoutResultsComponent],
  template: `
    <div class="w-full max-w-2xl mx-auto py-8 px-4">
      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              [class.bg-blue-600]="step() === 'type-selection'"
              [class.text-white]="step() === 'type-selection'"
              [class.bg-gray-300]="step() !== 'type-selection'"
              [class.text-gray-600]="step() !== 'type-selection'"
            >
              1
            </div>
            <span class="ml-2 text-sm font-medium" [class.text-blue-600]="step() === 'type-selection'"> Type </span>
          </div>

          <div class="w-12 h-0.5 bg-gray-300"></div>

          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              [class.bg-blue-600]="step() === 'params'"
              [class.text-white]="step() === 'params'"
              [class.bg-gray-300]="step() !== 'params'"
              [class.text-gray-600]="step() !== 'params'"
            >
              2
            </div>
            <span class="ml-2 text-sm font-medium" [class.text-blue-600]="step() === 'params'"> Parameters </span>
          </div>

          <div class="w-12 h-0.5 bg-gray-300"></div>

          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              [class.bg-blue-600]="step() === 'generating' || step() === 'results'"
              [class.text-white]="step() === 'generating' || step() === 'results'"
              [class.bg-gray-300]="step() !== 'generating' && step() !== 'results'"
              [class.text-gray-600]="step() !== 'generating' && step() !== 'results'"
            >
              3
            </div>
            <span
              class="ml-2 text-sm font-medium"
              [class.text-blue-600]="step() === 'generating' || step() === 'results'"
            >
              Workout
            </span>
          </div>
        </div>
      </div>

      <!-- Main Content -->

      @switch (step()) {
        @case ('type-selection') {
          <app-workout-type-selector (typeSelected)="onTypeSelected($event)" />
        }
        @case ('params') {
          <app-workout-params-form
            [workoutType]="selectedType() || 'hypertrophy'"
            [errorMessage]="error()"
            [isSubmitting]="isGenerating()"
            (paramsSubmitted)="onParamsSubmitted($event)"
            (backClicked)="onBackToTypeSelection()"
          />
        }
        @case ('generating') {
          <div class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Generating Your Workout</h2>
            <p class="text-gray-600">This may take up to 30 seconds...</p>
          </div>
        }
        @case ('results') {
          @if (generatedWorkout()) {
            <app-workout-results
              [workout]="generatedWorkout()!"
              [isRevising]="isRevising()"
              [revisingExerciseIndex]="revisingExerciseIndex()"
              [revisingIntervalIndex]="revisingIntervalIndex()"
              [isSaving]="isSaving()"
              [isSaved]="isSaved()"
              [savedWorkoutId]="savedWorkoutId()"
              [error]="error()"
              (backToEdit)="onBackToParams()"
              (startOver)="onStartOver()"
              (saveRequested)="onSaveRequested()"
              (workoutRevisionRequested)="onWorkoutRevisionRequested($event)"
              (exerciseRevisionRequested)="onExerciseRevisionRequested($event)"
              (intervalRevisionRequested)="onIntervalRevisionRequested($event)"
              (workoutChanged)="onWorkoutChanged($event)"
            />
          }
        }
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
export class NewWorkoutComponent {
  private readonly workoutService = inject(WorkoutService);
  private readonly router = inject(Router);

  // Expose service signals
  step = this.workoutService.step;
  selectedType = this.workoutService.selectedType;
  generatedWorkout = this.workoutService.generatedWorkout;
  error = this.workoutService.error;
  isGenerating = this.workoutService.isGenerating;

  // Phase 5 signals
  isRevising = this.workoutService.isRevising;
  revisingExerciseIndex = this.workoutService.revisingExerciseIndex;
  revisingIntervalIndex = this.workoutService.revisingIntervalIndex;
  isSaving = this.workoutService.isSaving;
  isSaved = computed(() => this.workoutService.savedWorkoutId() !== null);
  savedWorkoutId = this.workoutService.savedWorkoutId;

  onTypeSelected(type: WorkoutType): void {
    this.workoutService.selectWorkoutType(type);
  }

  async onParamsSubmitted(params: Partial<WorkoutInput>): Promise<void> {
    try {
      await this.workoutService.generateWorkout(params);
    } catch (err) {
      console.error('Failed to generate workout:', err);
    }
  }

  onBackToTypeSelection(): void {
    this.workoutService.goBack();
  }

  onBackToParams(): void {
    this.workoutService.goBack();
  }

  onStartOver(): void {
    this.workoutService.reset();
  }

  async onSaveRequested(): Promise<void> {
    try {
      await this.workoutService.saveWorkout();
    } catch (err) {
      console.error('Failed to save workout:', err);
    }
  }

  async onWorkoutRevisionRequested(revisionText: string): Promise<void> {
    try {
      await this.workoutService.reviseWorkout(revisionText);
    } catch (err) {
      console.error('Failed to revise workout:', err);
    }
  }

  async onExerciseRevisionRequested(event: { index: number; text: string }): Promise<void> {
    try {
      await this.workoutService.reviseExercise(event.index, event.text);
    } catch (err) {
      console.error('Failed to revise exercise:', err);
    }
  }

  async onIntervalRevisionRequested(event: { index: number; text: string }): Promise<void> {
    try {
      await this.workoutService.reviseInterval(event.index, event.text);
    } catch (err) {
      console.error('Failed to revise interval:', err);
    }
  }

  onWorkoutChanged(workout: WorkoutOutput): void {
    this.workoutService.updateWorkout(workout);
  }
}
