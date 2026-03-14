import { Directive } from '@angular/core';
import { NgpDescription } from 'ng-primitives/form-field';

@Directive({
  selector: 'p[uiDescription], div[uiDescription], span[uiDescription]',
  standalone: true,
  hostDirectives: [NgpDescription],
  host: {
    class: 'text-sm text-surface-500',
    '[attr.data-ui]': "'description'",
  },
})
export class UiDescriptionDirective {}
