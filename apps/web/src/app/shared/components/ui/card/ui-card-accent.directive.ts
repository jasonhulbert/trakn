import { computed, Directive, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiCardAccentColor } from './ui-card.types';

const COLOR_CLASSES: Record<UiCardAccentColor, string> = {
  primary: 'bg-primary-500',
  cyan: 'bg-cyan-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  success: 'bg-success-500',
  danger: 'bg-danger-500',
  warning: 'bg-warning-500',
  info: 'bg-info-500',
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
  readonly color = input<UiCardAccentColor>('primary');

  protected readonly hostClass = computed(() =>
    cx('absolute inset-y-[var(--radius-xl)] left-1.5 w-1 rounded-full', COLOR_CLASSES[this.color()])
  );
}
