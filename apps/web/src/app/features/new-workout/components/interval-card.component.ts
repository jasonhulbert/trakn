import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Interval } from '@trkn-shared';

@Component({
  selector: 'app-interval-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-gray-300 rounded-lg p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">Interval {{ interval().interval_number }}</h3>
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
      </div>

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
    </div>
  `,
  styles: ``,
})
export class IntervalCardComponent {
  interval = input.required<Interval>();

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
    // Convert snake_case to Title Case
    return modality
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
