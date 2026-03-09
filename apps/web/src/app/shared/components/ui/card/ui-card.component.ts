import { Component, computed, input } from '@angular/core';
import { cx, UI_STYLES } from '../_internal';
import type { UiCardPadding, UiCardVariant } from './ui-card.types';

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

  protected readonly hostClass = computed(() => cx('block', this.variantClass(), this.paddingClass()));

  private readonly variantClass = computed((): string => {
    switch (this.variant()) {
      case 'default':
        return UI_STYLES.cardBase;
      case 'outline':
        return 'border border-gray-200 rounded-lg bg-transparent';
      case 'elevated':
        return 'bg-white rounded-lg shadow-md';
      case 'ghost':
        return 'rounded-lg';
    }
  });

  private readonly paddingClass = computed((): string => {
    switch (this.padding()) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
    }
  });
}
