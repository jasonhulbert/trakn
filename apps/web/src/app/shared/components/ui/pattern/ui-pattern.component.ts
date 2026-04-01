import { Component, computed, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiPatternType } from './ui-pattern.types';

const PATTERN_CLASSES: Record<UiPatternType, string> = {
  hypertrophy: 'pattern-hypertrophy',
  strength: 'pattern-strength',
  conditioning: 'pattern-conditioning',
};

@Component({
  selector: 'ui-pattern',
  standalone: true,
  template: '',
  host: {
    '[class]': 'hostClass()',
    '[style.opacity]': 'opacity()',
    '[attr.data-ui]': "'pattern'",
    '[attr.data-type]': 'type()',
  },
})
export class UiPatternComponent {
  readonly type = input.required<UiPatternType>();
  readonly opacity = input<number>(0.08);

  protected readonly hostClass = computed(() =>
    cx('absolute inset-0 pointer-events-none', PATTERN_CLASSES[this.type()])
  );
}
