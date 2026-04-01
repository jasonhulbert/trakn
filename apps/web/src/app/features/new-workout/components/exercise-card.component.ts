import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Exercise, ExerciseSet, WorkoutType } from '@trkn-shared';
import {
  UiButtonDirective,
  UiCardBodyDirective,
  UiCardComponent,
  UiCardFooterDirective,
  UiCardHeaderDirective,
  UiInputDirective,
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

const WORKOUT_TYPE_COLOR = {
  hypertrophy: 'default',
  strength: 'default',
  conditioning: 'default',
} as const;

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [
    FormsModule,
    RevisionInputComponent,
    UiButtonDirective,
    UiCardComponent,
    UiCardHeaderDirective,
    UiCardBodyDirective,
    UiCardFooterDirective,
    UiInputDirective,
    UiTextareaDirective,
    UiTableContainerDirective,
    UiTableDirective,
    UiTableHeaderDirective,
    UiTableBodyDirective,
    UiTableRowDirective,
    UiTableHeadDirective,
    UiTableCellDirective,
  ],
  template: `
    <ui-card padding="none">
      <!-- Header -->
      <div uiCardHeader [color]="headerColor()">
        @if (isEditing()) {
          <input uiInput type="text" [ngModel]="editName" (ngModelChange)="editName = $event" class="flex-1 mr-2" />
        } @else {
          <h3 class="text-lg font-semibold">{{ exercise().exercise_name }}</h3>
        }
        <button type="button" uiButton color="default" variant="ghost" size="sm" (click)="toggleEdit()">
          {{ isEditing() ? 'Done' : 'Edit' }}
        </button>
      </div>

      <!-- Body -->
      <div uiCardBody>
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
          <div class="mb-3 p-3 bg-base-800 border border-base-700 rounded-md">
            <p class="text-sm text-fore-300">{{ exercise().notes }}</p>
          </div>
        }

        <!-- Sets Table -->
        <div uiTableContainer>
          <table uiTable>
            <thead uiTableHeader>
              <tr>
                <th uiTableHead>Set</th>
                <th uiTableHead>Reps</th>
                <th uiTableHead>Weight</th>
                <th uiTableHead>Rest</th>
              </tr>
            </thead>
            <tbody uiTableBody>
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
                        <span class="text-xs text-fore-600">{{ set.weight_unit || 'lbs' }}</span>
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
                        <span class="text-xs text-fore-600">sec</span>
                      </div>
                    </td>
                  } @else {
                    <td uiTableCell>{{ set.reps }}</td>
                    <td uiTableCell>
                      @if (set.suggested_weight !== undefined) {
                        {{ set.suggested_weight }} {{ set.weight_unit || 'lbs' }}
                      } @else {
                        <span class="text-fore-700">&mdash;</span>
                      }
                    </td>
                    <td uiTableCell>{{ formatRestDuration(set.rest_duration_seconds) }}</td>
                  }
                </tr>
                @if (isEditing()) {
                  <tr uiTableRow>
                    <td colspan="4" class="px-4 py-2">
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
                    <td colspan="4" class="px-4 py-2 text-xs text-fore-600 italic">{{ set.notes }}</td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer: Revision Input -->
      <div uiCardFooter muted>
        <div class="w-full">
          <app-revision-input
            label="Revise Exercise"
            placeholder="e.g. 'Make it harder' or 'Replace with a dumbbell alternative'"
            [isLoading]="isRevising()"
            (submitted)="onRevisionSubmitted($event)"
          />
        </div>
      </div>
    </ui-card>
  `,
  styles: ``,
})
export class ExerciseCardComponent {
  exercise = input.required<Exercise>();
  exerciseIndex = input.required<number>();
  workoutType = input<WorkoutType>('hypertrophy');
  isRevising = input<boolean>(false);

  protected readonly headerColor = computed(() => WORKOUT_TYPE_COLOR[this.workoutType()]);

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
