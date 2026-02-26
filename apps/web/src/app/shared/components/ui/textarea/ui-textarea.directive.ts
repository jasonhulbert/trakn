import { Directive } from '@angular/core';
import { NgpTextarea } from 'ng-primitives/textarea';
import { cx, UI_STYLES } from '../_internal';

@Directive({
  selector: 'textarea[uiTextarea]',
  standalone: true,
  hostDirectives: [NgpTextarea],
  host: {
    '[class]': 'hostClass',
    '[attr.data-ui]': "'textarea'",
  },
})
export class UiTextareaDirective {
  protected readonly hostClass = cx(
    UI_STYLES.textareaBase,
    UI_STYLES.inputInteractive,
    UI_STYLES.disabled,
    UI_STYLES.textBody
  );
}
