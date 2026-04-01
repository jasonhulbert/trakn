import { Component, computed, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiCardPadding, UiCardVariant } from './ui-card.types';

const VARIANT_CLASSES: Record<UiCardVariant, string> = {
  default: 'relative bg-base-900 border border-border rounded-xl overflow-hidden',
  outline: 'relative border border-border rounded-xl overflow-hidden bg-transparent',
  elevated: 'relative bg-base-800 rounded-xl overflow-hidden shadow-md shadow-black/30',
  ghost: 'relative rounded-xl overflow-hidden',
};

const PADDING_CLASSES: Record<UiCardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-ui]': "'card'",
    '[attr.data-variant]': 'variant()',
  },
})
export class UiCardComponent {
  variant = input<UiCardVariant>('default');
  padding = input<UiCardPadding>('md');

  protected readonly hostClass = computed(() =>
    cx('block', VARIANT_CLASSES[this.variant()], PADDING_CLASSES[this.padding()])
  );
}
