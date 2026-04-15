import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { cx } from '../_internal';

@Directive({
  selector: '[uiCardFooter]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-ui]': "'card-footer'",
  },
})
export class UiCardFooterDirective {
  /** Applies a muted background — use for action footers in composed cards. */
  readonly muted = input(false, { transform: booleanAttribute });

  protected readonly hostClass = computed(() =>
    cx('flex items-center px-4 py-3 border-t border-border', this.muted() && 'bg-base-800')
  );
}
