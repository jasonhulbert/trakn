import { Directive } from '@angular/core';
import { NgpFormField } from 'ng-primitives/form-field';

@Directive({
  selector: '[uiFormField]',
  standalone: true,
  hostDirectives: [NgpFormField],
  host: {
    class: 'block space-y-1.5',
    '[attr.data-ui]': "'form-field'",
  },
})
export class UiFormFieldDirective {}
