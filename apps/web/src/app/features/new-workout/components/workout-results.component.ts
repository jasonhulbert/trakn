import { Component, effect, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { WorkoutOutput } from '@trkn-shared';
import { WorkoutEditorComponent } from '../../../shared/components/workout-editor/workout-editor.component';
import { UiButtonDirective, UiToastService } from 'src/app/shared/components';

@Component({
  selector: 'app-workout-results',
  standalone: true,
  imports: [RouterLink, WorkoutEditorComponent, UiButtonDirective],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Saved Success Banner -->
      @if (isSaved() && savedWorkoutId()) {
        <div class="mb-6 p-4 bg-accent-500/10 border border-accent-500/20 rounded-lg flex items-center justify-between">
          <p class="text-sm font-medium text-accent-400">Workout saved successfully!</p>
          <div class="flex items-center gap-3">
            <a
              [routerLink]="['/workouts', savedWorkoutId()]"
              class="text-sm text-accent-500 hover:text-accent-400 underline"
            >
              View Workout
            </a>
            <button type="button" (click)="onStartOver()" class="text-sm text-accent-500 hover:text-accent-400 underline">
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
      <div class="flex justify-between pt-6 border-t border-base-700">
        <div class="flex gap-3">
          <button type="button" uiButton (click)="onBackToEdit()">Modify Parameters</button>
          <button type="button" uiButton (click)="onStartOver()">Start Over</button>
        </div>
        @if (!isSaved()) {
          <button type="button" uiButton (click)="onSave()" [disabled]="isSaving()">
            {{ isSaving() ? 'Saving...' : 'Save Workout' }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class WorkoutResultsComponent {
  private readonly toast = inject(UiToastService);
  private readonly lastSavedToastWorkoutId = signal<string | null>(null);

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

  constructor() {
    effect(() => {
      const isSaved = this.isSaved();
      const workoutId = this.savedWorkoutId();

      if (!isSaved || !workoutId) {
        this.lastSavedToastWorkoutId.set(null);
        return;
      }

      if (this.lastSavedToastWorkoutId() === workoutId) {
        return;
      }

      this.toast.success('Workout saved successfully!', 'Saved');
      this.lastSavedToastWorkoutId.set(workoutId);
    });
  }

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
