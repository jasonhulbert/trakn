import { computed, Directive, input } from '@angular/core';
import { cx } from '../_internal';
import type { UiCardBodyPadding } from './ui-card.types';

const PADDING_CLASSES: Record<UiCardBodyPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

@Directive({
  selector: '[uiCardBody]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-ui]': "'card-body'",
  },
})
export class UiCardBodyDirective {
  readonly padding = input<UiCardBodyPadding>('md');

  protected readonly hostClass = computed(() => cx('block', PADDING_CLASSES[this.padding()]));
}
