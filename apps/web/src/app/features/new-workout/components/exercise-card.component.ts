import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Exercise, ExerciseSet } from '@trkn-shared';
import { RevisionInputComponent } from './revision-input.component';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [FormsModule, RevisionInputComponent],
  template: `
    <div class="bg-white border border-gray-300 rounded-lg p-4">
      <!-- Navbar -->
      <div class="flex items-center justify-between mb-3">
        @if (isEditing()) {
          <input
            type="text"
            [ngModel]="editName"
            (ngModelChange)="editName = $event"
            class="text-lg font-semibold border border-gray-300 rounded-md px-2 py-1 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        } @else {
          <h3 class="text-lg font-semibold">{{ exercise().exercise_name }}</h3>
        }
        <button
          type="button"
          (click)="toggleEdit()"
          class="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
        >
          {{ isEditing() ? 'Done' : 'Edit' }}
        </button>
      </div>

      <!-- Notes -->
      @if (isEditing()) {
        <div class="mb-3">
          <textarea
            [ngModel]="editNotes"
            (ngModelChange)="editNotes = $event"
            placeholder="Exercise notes (optional)"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>
      } @else if (exercise().notes) {
        <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-gray-700">{{ exercise().notes }}</p>
        </div>
      }

      <!-- Sets Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rest</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (set of exercise().sets; track $index) {
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900">{{ $index + 1 }}</td>
                @if (isEditing()) {
                  <td class="px-4 py-2">
                    <input
                      type="number"
                      [ngModel]="editSets[$index]?.reps"
                      (ngModelChange)="updateSetField($index, 'reps', $event)"
                      min="1"
                      class="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <div class="flex items-center gap-1">
                      <input
                        type="number"
                        [ngModel]="editSets[$index]?.suggested_weight"
                        (ngModelChange)="updateSetField($index, 'suggested_weight', $event)"
                        class="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span class="text-xs text-gray-500">{{ set.weight_unit || 'lbs' }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-2">
                    <div class="flex items-center gap-1">
                      <input
                        type="number"
                        [ngModel]="editSets[$index]?.rest_duration_seconds"
                        (ngModelChange)="updateSetField($index, 'rest_duration_seconds', $event)"
                        min="0"
                        class="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span class="text-xs text-gray-500">sec</span>
                    </div>
                  </td>
                } @else {
                  <td class="px-4 py-2 text-sm text-gray-900">{{ set.reps }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">
                    @if (set.suggested_weight !== undefined) {
                      {{ set.suggested_weight }} {{ set.weight_unit || 'lbs' }}
                    } @else {
                      <span class="text-gray-400">&mdash;</span>
                    }
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ formatRestDuration(set.rest_duration_seconds) }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Revision Input -->
      <div class="mt-3 pt-3 border-t border-gray-100">
        <app-revision-input
          label="Revise Exercise"
          placeholder="e.g. 'Make it harder' or 'Replace with a dumbbell alternative'"
          [isLoading]="isRevising()"
          (submitted)="onRevisionSubmitted($event)"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class ExerciseCardComponent {
  exercise = input.required<Exercise>();
  exerciseIndex = input.required<number>();
  isRevising = input<boolean>(false);

  exerciseChanged = output<Exercise>();
  revisionRequested = output<{ index: number; text: string }>();

  isEditing = signal(false);

  // Edit state (initialized when entering edit mode)
  editName = '';
  editNotes = '';
  editSets: ExerciseSet[] = [];

  toggleEdit(): void {
    if (this.isEditing()) {
      // Exiting edit mode — emit changes
      const updated: Exercise = {
        exercise_name: this.editName,
        sets: this.editSets,
        notes: this.editNotes || undefined,
      };
      this.exerciseChanged.emit(updated);
      this.isEditing.set(false);
    } else {
      // Entering edit mode — copy current values
      const ex = this.exercise();
      this.editName = ex.exercise_name;
      this.editNotes = ex.notes ?? '';
      this.editSets = ex.sets.map((s) => ({ ...s }));
      this.isEditing.set(true);
    }
  }

  updateSetField(index: number, field: keyof ExerciseSet, value: number): void {
    if (this.editSets[index]) {
      this.editSets[index] = { ...this.editSets[index], [field]: value };
    }
  }

  onRevisionSubmitted(text: string): void {
    this.revisionRequested.emit({ index: this.exerciseIndex(), text });
  }

  formatRestDuration(seconds: number): string {
    if (seconds === 0) {
      return 'None';
    }
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }
}
