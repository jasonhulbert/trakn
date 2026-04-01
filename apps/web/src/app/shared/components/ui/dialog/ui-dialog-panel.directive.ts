import { Directive } from '@angular/core';
import { NgpDialog } from 'ng-primitives/dialog';

@Directive({
  selector: '[uiDialogPanel]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgpDialog,
      inputs: ['id', 'ngpDialogRole: uiDialogRole', 'ngpDialogModal: uiDialogModal'],
    },
  ],
  host: {
    class:
      'fixed left-1/2 top-1/2 z-50 w-[min(36rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-base-900 p-6 shadow-xl focus-visible:outline-none',
    '[attr.data-ui]': "'dialog-panel'",
  },
})
export class UiDialogPanelDirective {}
