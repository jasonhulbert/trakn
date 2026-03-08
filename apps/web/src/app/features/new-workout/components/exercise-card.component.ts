import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Exercise, ExerciseSet } from '@trkn-shared';
import {
  UiButtonDirective,
  UiInputDirective,
  UiSeparatorDirective,
  UiTableBodyDirective,
  UiTableCellDirective,
  UiTableContainerDirective,
  UiTableDirective,
  UiTableHeadDirective,
  UiTableHeaderDirective,
  UiTableRowDirective,
  UiTextareaDirective,
} from 'src/app/shared/components';
import { RevisionInputComponent } from './revision-input.component';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [
    FormsModule,
    RevisionInputComponent,
    UiButtonDirective,
    UiInputDirective,
    UiTextareaDirective,
    UiSeparatorDirective,
    UiTableContainerDirective,
    UiTableDirective,
    UiTableHeaderDirective,
    UiTableBodyDirective,
    UiTableRowDirective,
    UiTableHeadDirective,
    UiTableCellDirective,
  ],
  template: `
    <div class="bg-white border border-gray-300 rounded-lg p-4">
      <!-- Navbar -->
      <div class="flex items-center justify-between mb-3">
        @if (isEditing()) {
          <input uiInput type="text" [ngModel]="editName" (ngModelChange)="editName = $event" class="flex-1 mr-2" />
        } @else {
          <h3 class="text-lg font-semibold">{{ exercise().exercise_name }}</h3>
        }
        <button type="button" uiButton (click)="toggleEdit()">
          {{ isEditing() ? 'Done' : 'Edit' }}
        </button>
      </div>

      <!-- Notes -->
      @if (isEditing()) {
        <div class="mb-3">
          <textarea
            uiTextarea
            [ngModel]="editNotes"
            (ngModelChange)="editNotes = $event"
            placeholder="Exercise notes (optional)"
            rows="2"
            class="text-sm"
          ></textarea>
        </div>
      } @else if (exercise().notes) {
        <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-gray-700">{{ exercise().notes }}</p>
        </div>
      }

      <!-- Sets Table -->
      <div uiTableContainer>
        <table uiTable class="divide-y divide-gray-200">
          <thead uiTableHeader>
            <tr>
              <th uiTableHead>Set</th>
              <th uiTableHead>Reps</th>
              <th uiTableHead>Weight</th>
              <th uiTableHead>Rest</th>
            </tr>
          </thead>
          <tbody uiTableBody class="divide-y divide-gray-200">
            @for (set of exercise().sets; track $index) {
              <tr uiTableRow>
                <td uiTableCell>{{ $index + 1 }}</td>
                @if (isEditing()) {
                  <td uiTableCell>
                    <input
                      uiInput
                      type="number"
                      [ngModel]="editSets[$index]?.reps"
                      (ngModelChange)="updateSetField($index, 'reps', $event)"
                      min="1"
                      class="w-16"
                    />
                  </td>
                  <td uiTableCell>
                    <div class="flex items-center gap-1">
                      <input
                        uiInput
                        type="number"
                        [ngModel]="editSets[$index]?.suggested_weight"
                        (ngModelChange)="updateSetField($index, 'suggested_weight', $event)"
                        class="w-16"
                      />
                      <span class="text-xs text-gray-500">{{ set.weight_unit || 'lbs' }}</span>
                    </div>
                  </td>
                  <td uiTableCell>
                    <div class="flex items-center gap-1">
                      <input
                        uiInput
                        type="number"
                        [ngModel]="editSets[$index]?.rest_duration_seconds"
                        (ngModelChange)="updateSetField($index, 'rest_duration_seconds', $event)"
                        min="0"
                        class="w-16"
                      />
                      <span class="text-xs text-gray-500">sec</span>
                    </div>
                  </td>
                } @else {
                  <td uiTableCell>{{ set.reps }}</td>
                  <td uiTableCell>
                    @if (set.suggested_weight !== undefined) {
                      {{ set.suggested_weight }} {{ set.weight_unit || 'lbs' }}
                    } @else {
                      <span class="text-gray-400">&mdash;</span>
                    }
                  </td>
                  <td uiTableCell>{{ formatRestDuration(set.rest_duration_seconds) }}</td>
                }
              </tr>
              @if (isEditing()) {
                <tr uiTableRow>
                  <td></td>
                  <td colspan="3" class="px-4 py-2">
                    <input
                      uiInput
                      type="text"
                      [ngModel]="editSets[$index]?.notes"
                      (ngModelChange)="updateSetField($index, 'notes', $event)"
                      placeholder="Set note (optional)"
                      class="w-full"
                    />
                  </td>
                </tr>
              } @else if (set.notes) {
                <tr uiTableRow>
                  <td></td>
                  <td colspan="3" class="px-4 py-2 text-xs text-gray-500 italic">{{ set.notes }}</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Revision Input -->
      <div class="mt-3">
        <div uiSeparator class="mb-3"></div>
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

  updateSetField(index: number, field: keyof ExerciseSet, value: string | number): void {
    if (this.editSets[index]) {
      const processed = typeof value === 'string' ? value.trim() || undefined : value;
      this.editSets[index] = { ...this.editSets[index], [field]: processed };
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
