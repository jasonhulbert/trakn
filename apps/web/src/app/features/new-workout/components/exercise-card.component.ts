import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Exercise } from '@trkn-shared';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-gray-300 rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-3">{{ exercise().exercise_name }}</h3>

      @if (exercise().notes) {
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
                <td class="px-4 py-2 text-sm text-gray-900">{{ set.reps }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">
                  @if (set.suggested_weight !== undefined) {
                    {{ set.suggested_weight }} {{ set.weight_unit || 'lbs' }}
                  } @else {
                    <span class="text-gray-400">—</span>
                  }
                </td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ formatRestDuration(set.rest_duration_seconds) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: ``,
})
export class ExerciseCardComponent {
  exercise = input.required<Exercise>();

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
