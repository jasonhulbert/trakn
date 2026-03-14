import { Directive } from '@angular/core';
import { NgpDialogTitle } from 'ng-primitives/dialog';

@Directive({
  selector: 'h1[uiDialogTitle], h2[uiDialogTitle], h3[uiDialogTitle], h4[uiDialogTitle]',
  standalone: true,
  hostDirectives: [NgpDialogTitle],
  host: {
    class: 'text-lg font-semibold text-surface-900',
    '[attr.data-ui]': "'dialog-title'",
  },
})
export class UiDialogTitleDirective {}
