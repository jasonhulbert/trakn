import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { WorkoutOutput } from '@trkn-shared';
import { WorkoutEditorComponent } from '../../../shared/components/workout-editor/workout-editor.component';

@Component({
  selector: 'app-workout-results',
  standalone: true,
  imports: [RouterLink, WorkoutEditorComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Saved Success Banner -->
      @if (isSaved() && savedWorkoutId()) {
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <p class="text-sm font-medium text-green-800">Workout saved successfully!</p>
          <div class="flex items-center gap-3">
            <a
              [routerLink]="['/workouts', savedWorkoutId()]"
              class="text-sm text-green-700 hover:text-green-900 underline"
            >
              View Workout
            </a>
            <button type="button" (click)="onStartOver()" class="text-sm text-green-700 hover:text-green-900 underline">
              Create Another
            </button>
          </div>
        </div>
      }

      <app-workout-editor
        [workout]="workout()"
        [editable]="!isSaved()"
        [isRevising]="isRevising()"
        [revisingExerciseIndex]="revisingExerciseIndex()"
        [revisingIntervalIndex]="revisingIntervalIndex()"
        [error]="error()"
        (workoutRevisionRequested)="workoutRevisionRequested.emit($event)"
        (exerciseRevisionRequested)="exerciseRevisionRequested.emit($event)"
        (intervalRevisionRequested)="intervalRevisionRequested.emit($event)"
        (workoutChanged)="workoutChanged.emit($event)"
      />

      <!-- Actions -->
      <div class="flex justify-between pt-6 border-t border-gray-200">
        <div class="flex gap-3">
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
        @if (!isSaved()) {
          <button
            type="button"
            (click)="onSave()"
            [disabled]="isSaving()"
            class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            @if (isSaving()) {
              <span
                class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              Saving...
            } @else {
              Save Workout
            }
          </button>
        }
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
export class WorkoutResultsComponent {
  workout = input.required<WorkoutOutput>();
  isRevising = input<boolean>(false);
  revisingExerciseIndex = input<number | null>(null);
  revisingIntervalIndex = input<number | null>(null);
  isSaving = input<boolean>(false);
  isSaved = input<boolean>(false);
  savedWorkoutId = input<string | null>(null);
  error = input<string | null>(null);

  backToEdit = output<void>();
  startOver = output<void>();
  saveRequested = output<void>();
  workoutRevisionRequested = output<string>();
  exerciseRevisionRequested = output<{ index: number; text: string }>();
  intervalRevisionRequested = output<{ index: number; text: string }>();
  workoutChanged = output<WorkoutOutput>();

  onBackToEdit(): void {
    this.backToEdit.emit();
  }

  onStartOver(): void {
    this.startOver.emit();
  }

  onSave(): void {
    this.saveRequested.emit();
  }
}
