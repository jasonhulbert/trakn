import { Directive } from '@angular/core';
import { NgpButton } from 'ng-primitives/button';
import { cx, UI_STYLES } from '../_internal';

@Directive({
  selector: 'button[uiButton], a[uiButton]',
  standalone: true,
  hostDirectives: [NgpButton],
  host: {
    '[class]': 'hostClass',
    '[attr.data-ui]': "'button'",
  },
})
export class UiButtonDirective {
  protected readonly hostClass = cx(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'px-4 py-2 text-sm font-medium transition-colors',
    'bg-blue-600 text-white hover:bg-blue-700',
    UI_STYLES.radiusMd,
    UI_STYLES.focusVisibleRing,
    UI_STYLES.disabled
  );
}
