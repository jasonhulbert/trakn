import { Component, output } from '@angular/core';
import type { WorkoutType } from '@trkn-shared';
import { UiCardAccentDirective, UiCardBodyDirective, UiCardComponent } from 'src/app/shared/components';

interface WorkoutTypeOption {
  type: WorkoutType;
  label: string;
  description: string;
  accentColor: 'violet' | 'rose' | 'cyan';
}

const HOVER_BORDER: Record<WorkoutTypeOption['accentColor'], string> = {
  violet: 'hover:border-violet-400',
  rose: 'hover:border-rose-400',
  cyan: 'hover:border-cyan-400',
};

@Component({
  selector: 'app-workout-type-selector',
  standalone: true,
  imports: [UiCardComponent, UiCardAccentDirective, UiCardBodyDirective],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-2">Choose Your Workout Type</h2>
      <p class="text-surface-500 mb-6">Select the type of training that matches your goals</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (option of workoutTypes; track option.type) {
          <button
            type="button"
            class="text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl"
            (click)="selectType(option.type)"
          >
            <ui-card padding="none" class="{{ hoverBorder(option.accentColor) }} transition-colors">
              <div uiCardAccent [color]="option.accentColor"></div>
              <div uiCardBody>
                <h3 class="text-xl font-semibold mb-2">{{ option.label }}</h3>
                <p class="text-surface-500 text-sm">{{ option.description }}</p>
              </div>
            </ui-card>
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
      accentColor: 'violet',
    },
    {
      type: 'strength',
      label: 'Strength',
      description: 'Increase maximal force production with heavy compound movements',
      accentColor: 'rose',
    },
    {
      type: 'conditioning',
      label: 'Conditioning',
      description: 'Improve cardiovascular capacity with interval-based training',
      accentColor: 'cyan',
    },
  ];

  hoverBorder(color: WorkoutTypeOption['accentColor']): string {
    return HOVER_BORDER[color];
  }

  selectType(type: WorkoutType): void {
    this.typeSelected.emit(type);
  }
}
