import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Interval, IntensityLevel } from '@trkn-shared';
import { RevisionInputComponent } from './revision-input.component';

@Component({
  selector: 'app-interval-card',
  standalone: true,
  imports: [FormsModule, RevisionInputComponent],
  template: `
    <div class="bg-white border border-gray-300 rounded-lg p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">Interval {{ interval().interval_number }}</h3>
        <div class="flex items-center gap-2">
          @if (!isEditing()) {
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              [class.bg-green-100]="interval().intensity === 'low'"
              [class.text-green-800]="interval().intensity === 'low'"
              [class.bg-yellow-100]="interval().intensity === 'moderate'"
              [class.text-yellow-800]="interval().intensity === 'moderate'"
              [class.bg-orange-100]="interval().intensity === 'high'"
              [class.text-orange-800]="interval().intensity === 'high'"
              [class.bg-red-100]="interval().intensity === 'max'"
              [class.text-red-800]="interval().intensity === 'max'"
            >
              {{ formatIntensity(interval().intensity) }}
            </span>
          }
          <button
            type="button"
            (click)="toggleEdit()"
            class="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
          >
            {{ isEditing() ? 'Done' : 'Edit' }}
          </button>
        </div>
      </div>

      @if (isEditing()) {
        <div class="grid grid-cols-2 gap-4 mb-3">
          <label class="block">
            <span class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Modality</span>
            <select
              [ngModel]="editModality"
              (ngModelChange)="editModality = $event"
              class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              @for (mod of modalities; track mod) {
                <option [value]="mod">{{ formatModality(mod) }}</option>
              }
            </select>
          </label>
          <label class="block">
            <span class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Intensity</span>
            <select
              [ngModel]="editIntensity"
              (ngModelChange)="editIntensity = $event"
              class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              @for (level of intensityLevels; track level) {
                <option [value]="level">{{ formatIntensity(level) }}</option>
              }
            </select>
          </label>
          <label class="block">
            <span class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Work (seconds)</span>
            <input
              type="number"
              [ngModel]="editWorkDuration"
              (ngModelChange)="editWorkDuration = $event"
              min="1"
              class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label class="block">
            <span class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Rest (seconds)</span>
            <input
              type="number"
              [ngModel]="editRestDuration"
              (ngModelChange)="editRestDuration = $event"
              min="0"
              class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
        <label class="block">
          <span class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Notes</span>
          <textarea
            [ngModel]="editNotes"
            (ngModelChange)="editNotes = $event"
            placeholder="Interval notes (optional)"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </label>
      } @else {
        <div class="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Modality</p>
            <p class="text-sm font-medium text-gray-900">{{ formatModality(interval().modality) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Work</p>
            <p class="text-sm font-medium text-gray-900">{{ formatDuration(interval().work_duration_seconds) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Rest</p>
            <p class="text-sm font-medium text-gray-900">{{ formatDuration(interval().rest_duration_seconds) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Time</p>
            <p class="text-sm font-medium text-gray-900">
              {{ formatDuration(interval().work_duration_seconds + interval().rest_duration_seconds) }}
            </p>
          </div>
        </div>

        @if (interval().notes) {
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-sm text-gray-700">{{ interval().notes }}</p>
          </div>
        }
      }

      <!-- Revision Input -->
      <div class="mt-3 pt-3 border-t border-gray-100">
        <app-revision-input
          label="Revise Interval with AI"
          placeholder="e.g. 'Make it harder' or 'Switch to rowing' or 'Add more rest'"
          [isLoading]="isRevising()"
          (submitted)="onRevisionSubmitted($event)"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class IntervalCardComponent {
  interval = input.required<Interval>();
  intervalIndex = input.required<number>();
  isRevising = input<boolean>(false);

  intervalChanged = output<Interval>();
  revisionRequested = output<{ index: number; text: string }>();

  isEditing = signal(false);

  // Edit state
  editModality = '';
  editIntensity: IntensityLevel = 'moderate';
  editWorkDuration = 0;
  editRestDuration = 0;
  editNotes = '';

  readonly intensityLevels: IntensityLevel[] = ['low', 'moderate', 'high', 'max'];
  readonly modalities = [
    'running',
    'cycling',
    'rowing',
    'swimming',
    'jump_rope',
    'assault_bike',
    'elliptical',
    'stair_climber',
    'mixed',
  ];

  toggleEdit(): void {
    if (this.isEditing()) {
      // Exiting edit mode — emit changes
      const updated: Interval = {
        interval_number: this.interval().interval_number,
        work_duration_seconds: this.editWorkDuration,
        rest_duration_seconds: this.editRestDuration,
        intensity: this.editIntensity,
        modality: this.editModality as Interval['modality'],
        notes: this.editNotes || undefined,
      };
      this.intervalChanged.emit(updated);
      this.isEditing.set(false);
    } else {
      // Entering edit mode — copy current values
      const iv = this.interval();
      this.editModality = iv.modality;
      this.editIntensity = iv.intensity;
      this.editWorkDuration = iv.work_duration_seconds;
      this.editRestDuration = iv.rest_duration_seconds;
      this.editNotes = iv.notes ?? '';
      this.isEditing.set(true);
    }
  }

  onRevisionSubmitted(text: string): void {
    this.revisionRequested.emit({ index: this.intervalIndex(), text });
  }

  formatDuration(seconds: number): string {
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

  formatIntensity(intensity: string): string {
    return intensity.charAt(0).toUpperCase() + intensity.slice(1);
  }

  formatModality(modality: string): string {
    return modality
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
