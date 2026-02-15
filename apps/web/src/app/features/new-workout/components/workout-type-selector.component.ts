import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type WorkoutType = 'hypertrophy' | 'strength' | 'conditioning';

interface WorkoutTypeOption {
  type: WorkoutType;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-workout-type-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-2">Choose Your Workout Type</h2>
      <p class="text-gray-600 mb-6">Select the type of training that matches your goals</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (option of workoutTypes; track option.type) {
          <button
            type="button"
            (click)="selectType(option.type)"
            class="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
          >
            <div class="text-4xl mb-3">{{ option.icon }}</div>
            <h3 class="text-xl font-semibold mb-2">{{ option.label }}</h3>
            <p class="text-gray-600 text-sm">{{ option.description }}</p>
          </button>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class WorkoutTypeSelectorComponent {
  typeSelected = output<WorkoutType>();

  workoutTypes: WorkoutTypeOption[] = [
    {
      type: 'hypertrophy',
      label: 'Hypertrophy',
      description: 'Build muscle size and definition with progressive overload training',
      icon: '💪',
    },
    {
      type: 'strength',
      label: 'Strength',
      description: 'Increase maximal force production with heavy compound movements',
      icon: '🏋️',
    },
    {
      type: 'conditioning',
      label: 'Conditioning',
      description: 'Improve cardiovascular capacity with interval-based training',
      icon: '🏃',
    },
  ];

  selectType(type: WorkoutType): void {
    this.typeSelected.emit(type);
  }
}
