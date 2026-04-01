import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Interval, IntensityLevel } from '@trkn-shared';
import {
  UiBadgeComponent,
  UiButtonDirective,
  UiCardBodyDirective,
  UiCardComponent,
  UiCardFooterDirective,
  UiCardHeaderDirective,
  UiInputDirective,
  UiSelectDirective,
  UiTextareaDirective,
} from 'src/app/shared/components';
import { RevisionInputComponent } from './revision-input.component';

const INTENSITY_COLOR = {
  low: 'default',
  moderate: 'default',
  high: 'danger',
  max: 'danger',
} as const;

@Component({
  selector: 'app-interval-card',
  standalone: true,
  imports: [
    FormsModule,
    RevisionInputComponent,
    UiBadgeComponent,
    UiButtonDirective,
    UiCardComponent,
    UiCardHeaderDirective,
    UiCardBodyDirective,
    UiCardFooterDirective,
    UiSelectDirective,
    UiInputDirective,
    UiTextareaDirective,
  ],
  template: `
    <ui-card padding="none">
      <!-- Header -->
      <div uiCardHeader color="default">
        <h3 class="text-lg font-semibold">Interval {{ interval().interval_number }}</h3>
        <div class="flex items-center gap-2">
          @if (!isEditing()) {
            <ui-badge [color]="intensityColor()" variant="soft">{{ formatIntensity(interval().intensity) }}</ui-badge>
          }
          <button type="button" uiButton variant="ghost" color="default" size="sm" (click)="toggleEdit()">
            {{ isEditing() ? 'Done' : 'Edit' }}
          </button>
        </div>
      </div>

      <!-- Body -->
      <div uiCardBody>
        @if (isEditing()) {
          <div class="grid grid-cols-2 gap-4 mb-3">
            <label class="block">
              <span class="text-xs text-fore-600 uppercase tracking-wider mb-1 block">Modality</span>
              <select
                uiSelect
                [ngModel]="editModality"
                (ngModelChange)="editModality = $event"
                class="px-2 py-1 text-sm"
              >
                @for (mod of modalities; track mod) {
                  <option [value]="mod">{{ formatModality(mod) }}</option>
                }
              </select>
            </label>
            <label class="block">
              <span class="text-xs text-fore-600 uppercase tracking-wider mb-1 block">Intensity</span>
              <select
                uiSelect
                [ngModel]="editIntensity"
                (ngModelChange)="editIntensity = $event"
                class="px-2 py-1 text-sm"
              >
                @for (level of intensityLevels; track level) {
                  <option [value]="level">{{ formatIntensity(level) }}</option>
                }
              </select>
            </label>
            <label class="block">
              <span class="text-xs text-fore-600 uppercase tracking-wider mb-1 block">Work (seconds)</span>
              <input
                uiInput
                type="number"
                [ngModel]="editWorkDuration"
                (ngModelChange)="editWorkDuration = $event"
                min="1"
                class="px-2 py-1 text-sm"
              />
            </label>
            <label class="block">
              <span class="text-xs text-fore-600 uppercase tracking-wider mb-1 block">Rest (seconds)</span>
              <input
                uiInput
                type="number"
                [ngModel]="editRestDuration"
                (ngModelChange)="editRestDuration = $event"
                min="0"
                class="px-2 py-1 text-sm"
              />
            </label>
          </div>
          <label class="block">
            <span class="text-xs text-fore-600 uppercase tracking-wider mb-1 block">Notes</span>
            <textarea
              uiTextarea
              [ngModel]="editNotes"
              (ngModelChange)="editNotes = $event"
              placeholder="Interval notes (optional)"
              rows="2"
              class="text-sm"
            ></textarea>
          </label>
        } @else {
          <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p class="text-xs text-fore-600 uppercase tracking-wider mb-1">Modality</p>
              <p class="text-sm font-medium text-fore-300">{{ formatModality(interval().modality) }}</p>
            </div>
            <div>
              <p class="text-xs text-fore-600 uppercase tracking-wider mb-1">Work</p>
              <p class="text-sm font-medium text-fore-300">{{ formatDuration(interval().work_duration_seconds) }}</p>
            </div>
            <div>
              <p class="text-xs text-fore-600 uppercase tracking-wider mb-1">Rest</p>
              <p class="text-sm font-medium text-fore-300">{{ formatDuration(interval().rest_duration_seconds) }}</p>
            </div>
            <div>
              <p class="text-xs text-fore-600 uppercase tracking-wider mb-1">Total Time</p>
              <p class="text-sm font-medium text-fore-300">
                {{ formatDuration(interval().work_duration_seconds + interval().rest_duration_seconds) }}
              </p>
            </div>
          </div>

          @if (interval().notes) {
            <div class="p-3 bg-base-800 border border-base-700 rounded-md">
              <p class="text-sm text-fore-300">{{ interval().notes }}</p>
            </div>
          }
        }
      </div>

      <!-- Footer: Revision Input -->
      <div uiCardFooter muted>
        <div class="w-full">
          <app-revision-input
            label="Revise Interval with AI"
            placeholder="e.g. 'Make it harder' or 'Switch to rowing' or 'Add more rest'"
            [isLoading]="isRevising()"
            (submitted)="onRevisionSubmitted($event)"
          />
        </div>
      </div>
    </ui-card>
  `,
  styles: ``,
})
export class IntervalCardComponent {
  interval = input.required<Interval>();
  intervalIndex = input.required<number>();
  isRevising = input<boolean>(false);

  protected readonly intensityColor = computed(() => INTENSITY_COLOR[this.interval().intensity]);

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
