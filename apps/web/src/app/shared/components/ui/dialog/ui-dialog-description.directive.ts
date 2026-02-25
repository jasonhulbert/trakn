import { Directive } from '@angular/core';
import { NgpDialogDescription } from 'ng-primitives/dialog';

@Directive({
  selector: 'p[uiDialogDescription], div[uiDialogDescription]',
  standalone: true,
  hostDirectives: [NgpDialogDescription],
  host: {
    class: 'mt-1 text-sm text-gray-600',
    '[attr.data-ui]': "'dialog-description'",
  },
})
export class UiDialogDescriptionDirective {}
