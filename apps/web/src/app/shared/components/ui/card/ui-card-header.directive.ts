import { computed, Directive, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiCardHeaderColor } from './ui-card.types';

const COLOR_CLASSES: Record<UiCardHeaderColor, string> = {
  surface: 'bg-white border-b border-surface-200 px-4 py-3',
  primary: 'bg-linear-to-r from-primary-400 to-primary-600 px-6 py-5 text-white',
  cyan: 'bg-linear-to-r from-cyan-400 to-cyan-600 px-6 py-5 text-white',
  violet: 'bg-linear-to-r from-violet-500 to-violet-600 px-6 py-5 text-white',
  rose: 'bg-linear-to-r from-rose-400 to-rose-600 px-6 py-5 text-white',
  success: 'bg-linear-to-r from-success-400 to-success-600 px-6 py-5 text-white',
  danger: 'bg-linear-to-r from-danger-400 to-danger-600 px-6 py-5 text-white',
  warning: 'bg-linear-to-r from-warning-400 to-warning-600 px-6 py-5 text-white',
};

@Directive({
  selector: '[uiCardHeader]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-ui]': "'card-header'",
    '[attr.data-color]': 'color()',
  },
})
export class UiCardHeaderDirective {
  readonly color = input<UiCardHeaderColor>('surface');

  protected readonly hostClass = computed(() => cx('flex items-center justify-between', COLOR_CLASSES[this.color()]));
}
