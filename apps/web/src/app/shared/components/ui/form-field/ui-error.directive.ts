import { Directive } from '@angular/core';
import { NgpError } from 'ng-primitives/form-field';

@Directive({
  selector: 'p[uiError], div[uiError], span[uiError]',
  standalone: true,
  hostDirectives: [NgpError],
  host: {
    class: 'text-sm text-red-600',
    '[attr.data-ui]': "'error'",
  },
})
export class UiErrorDirective {}
