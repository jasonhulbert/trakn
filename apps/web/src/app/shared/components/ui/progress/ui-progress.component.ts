import { Component, computed, input, numberAttribute } from '@angular/core';
import { NgpProgress, NgpProgressIndicator, NgpProgressTrack } from 'ng-primitives/progress';
import { cx, UI_STYLES } from '../_internal';

@Component({
  selector: 'ui-progress',
  standalone: true,
  imports: [NgpProgress, NgpProgressTrack, NgpProgressIndicator],
  template: `
    <div
      ngpProgress
      [ngpProgressValue]="value()"
      [ngpProgressMin]="min()"
      [ngpProgressMax]="max()"
      [attr.aria-label]="ariaLabel()"
      [class]="rootClass"
    >
      <div ngpProgressTrack [class]="trackClass">
        <div
          ngpProgressIndicator
          [class]="indicatorClass()"
          [style.width.%]="progressPercent()"
          [style.transform]="indicatorTransform()"
        ></div>
      </div>
    </div>
  `,
})
export class UiProgressComponent {
  value = input<number | null>(0);
  min = input(0, { transform: numberAttribute });
  max = input(100, { transform: numberAttribute });
  ariaLabel = input('Progress');

  protected readonly isIndeterminate = computed(() => this.value() === null);

  protected readonly progressPercent = computed(() => {
    const value = this.value();
    if (value === null) {
      return 40;
    }

    const min = this.min();
    const max = this.max();
    if (max <= min) {
      return 0;
    }

    const clamped = Math.min(max, Math.max(min, value));
    return ((clamped - min) / (max - min)) * 100;
  });

  protected readonly rootClass = cx('block w-full', UI_STYLES.focusVisibleRing);
  protected readonly trackClass = cx('relative h-2 w-full overflow-hidden rounded-full bg-gray-200');
  protected readonly indicatorClass = computed(() =>
    cx(
      'absolute inset-y-0 left-0 rounded-full bg-blue-600 transition-[width,transform]',
      this.isIndeterminate() && 'animate-pulse'
    )
  );
  protected readonly indicatorTransform = computed(() => (this.isIndeterminate() ? 'translateX(50%)' : null));
}
