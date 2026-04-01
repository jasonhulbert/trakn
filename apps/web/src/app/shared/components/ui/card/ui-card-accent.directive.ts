import { computed, Directive, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiCardAccentColor } from './ui-card.types';

const COLOR_CLASSES: Record<UiCardAccentColor, string> = {
  default: 'bg-fore-600',
  accent: 'bg-accent-500',
  danger: 'bg-danger-500',
};

@Directive({
  selector: '[uiCardAccent]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-ui]': "'card-accent'",
    '[attr.data-color]': 'color()',
  },
})
export class UiCardAccentDirective {
  readonly color = input<UiCardAccentColor>('default');

  protected readonly hostClass = computed(() =>
    cx('absolute inset-y-[var(--radius-xl)] left-1.5 w-1 rounded-full', COLOR_CLASSES[this.color()])
  );
}
