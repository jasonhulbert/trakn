import { Directive } from '@angular/core';
import { NgpNativeSelect } from 'ng-primitives/select';
import { cx, UI_STYLES } from '../_internal';

@Directive({
  selector: 'select[uiSelect]',
  standalone: true,
  hostDirectives: [NgpNativeSelect],
  host: {
    '[class]': 'hostClass',
    '[attr.data-ui]': "'select'",
  },
})
export class UiSelectDirective {
  protected readonly hostClass = cx(
    UI_STYLES.inputBase,
    UI_STYLES.inputInteractive,
    UI_STYLES.disabled,
    UI_STYLES.textBody,
    'appearance-none bg-white pr-8'
  );
}
