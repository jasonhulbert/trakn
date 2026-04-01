import { computed, Directive, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiCardHeaderColor } from './ui-card.types';

const COLOR_CLASSES: Record<UiCardHeaderColor, string> = {
  default: 'bg-base-800 border-b border-border px-4 py-3 text-fore-300',
  accent: 'bg-accent-900 border-b border-accent-700 px-6 py-5 text-accent-300',
  danger: 'bg-danger-900 border-b border-danger-700 px-6 py-5 text-danger-300',
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
  readonly color = input<UiCardHeaderColor>('default');

  protected readonly hostClass = computed(() => cx('flex items-center justify-between', COLOR_CLASSES[this.color()]));
}
