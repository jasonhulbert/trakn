import { computed, Component, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiBadgeColor, UiBadgeVariant } from './ui-badge.types';

const FILLED_COLORS: Record<UiBadgeColor, string> = {
  default: 'bg-fore-700 text-fore-100',
  accent: 'bg-accent-500 text-white',
  danger: 'bg-danger-500 text-white',
};

const SOFT_COLORS: Record<UiBadgeColor, string> = {
  default: 'bg-base-700 text-fore-300',
  accent: 'bg-accent-950 text-accent-400',
  danger: 'bg-danger-950 text-danger-400',
};

const OUTLINE_COLORS: Record<UiBadgeColor, string> = {
  default: 'border border-border text-fore-300 bg-transparent',
  accent: 'border border-accent-500 text-accent-400 bg-transparent',
  danger: 'border border-danger-500 text-danger-400 bg-transparent',
};

@Component({
  selector: 'ui-badge',
  standalone: true,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-ui]': "'badge'",
    '[attr.data-variant]': 'variant()',
    '[attr.data-color]': 'color()',
  },
})
export class UiBadgeComponent {
  readonly variant = input<UiBadgeVariant>('soft');
  readonly color = input<UiBadgeColor>('default');

  protected readonly hostClass = computed(() =>
    cx(
      'inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full',
      this.variant() === 'filled'
        ? (FILLED_COLORS[this.color()] ?? FILLED_COLORS.default)
        : this.variant() === 'outline'
          ? (OUTLINE_COLORS[this.color()] ?? OUTLINE_COLORS.default)
          : (SOFT_COLORS[this.color()] ?? SOFT_COLORS.default)
    )
  );
}
