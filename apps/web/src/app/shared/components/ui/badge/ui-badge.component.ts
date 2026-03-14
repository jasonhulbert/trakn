import { computed, Component, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiBadgeColor, UiBadgeVariant } from './ui-badge.types';

const FILLED_COLORS: Record<UiBadgeColor, string> = {
  primary: 'bg-primary-500 text-white',
  cyan: 'bg-cyan-500 text-white',
  violet: 'bg-violet-500 text-white',
  rose: 'bg-rose-500 text-white',
  success: 'bg-success-500 text-white',
  danger: 'bg-danger-500 text-white',
  warning: 'bg-warning-500 text-white',
  info: 'bg-info-500 text-white',
  surface: 'bg-surface-500 text-white',
};

const SOFT_COLORS: Record<UiBadgeColor, string> = {
  primary: 'bg-primary-100 text-primary-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  violet: 'bg-violet-100 text-violet-700',
  rose: 'bg-rose-100 text-rose-700',
  success: 'bg-success-100 text-success-700',
  danger: 'bg-danger-100 text-danger-700',
  warning: 'bg-warning-100 text-warning-700',
  info: 'bg-info-100 text-info-700',
  surface: 'bg-surface-100 text-surface-700',
};

const OUTLINE_COLORS: Record<UiBadgeColor, string> = {
  primary: 'border-2 border-primary-400 text-primary-600 bg-transparent',
  cyan: 'border-2 border-cyan-400 text-cyan-600 bg-transparent',
  violet: 'border-2 border-violet-400 text-violet-600 bg-transparent',
  rose: 'border-2 border-rose-400 text-rose-600 bg-transparent',
  success: 'border-2 border-success-400 text-success-600 bg-transparent',
  danger: 'border-2 border-danger-400 text-danger-600 bg-transparent',
  warning: 'border-2 border-warning-400 text-warning-600 bg-transparent',
  info: 'border-2 border-info-400 text-info-600 bg-transparent',
  surface: 'border-2 border-surface-300 text-surface-600 bg-transparent',
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
  readonly color = input<UiBadgeColor>('primary');

  protected readonly hostClass = computed(() =>
    cx(
      'inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full',
      this.variant() === 'filled'
        ? (FILLED_COLORS[this.color()] ?? FILLED_COLORS.primary)
        : this.variant() === 'outline'
          ? (OUTLINE_COLORS[this.color()] ?? OUTLINE_COLORS.primary)
          : (SOFT_COLORS[this.color()] ?? SOFT_COLORS.primary)
    )
  );
}
