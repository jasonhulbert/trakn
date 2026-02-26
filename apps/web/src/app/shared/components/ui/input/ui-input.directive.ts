import { Directive } from '@angular/core';
import { NgpInput } from 'ng-primitives/input';
import { cx, UI_STYLES } from '../_internal';

@Directive({
  selector: 'input[uiInput]',
  standalone: true,
  hostDirectives: [NgpInput],
  host: {
    '[class]': 'hostClass',
    '[attr.data-ui]': "'input'",
  },
})
export class UiInputDirective {
  protected readonly hostClass = cx(
    UI_STYLES.inputBase,
    UI_STYLES.inputInteractive,
    UI_STYLES.disabled,
    UI_STYLES.textBody
  );
}
