import { Directive } from '@angular/core';
import { NgpSeparator } from 'ng-primitives/separator';
import { cx } from '../_internal';

@Directive({
  selector: 'hr[uiSeparator], div[uiSeparator]',
  standalone: true,
  hostDirectives: [NgpSeparator],
  host: {
    '[class]': 'hostClass',
    '[attr.data-ui]': "'separator'",
  },
})
export class UiSeparatorDirective {
  protected readonly hostClass = cx('block shrink-0 border-0 bg-gray-200', 'h-px w-full');
}
