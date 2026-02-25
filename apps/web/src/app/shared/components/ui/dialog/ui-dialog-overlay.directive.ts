import { Directive } from '@angular/core';
import { NgpDialogOverlay } from 'ng-primitives/dialog';

@Directive({
  selector: '[uiDialogOverlay]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgpDialogOverlay,
      inputs: ['ngpDialogOverlayCloseOnClick: uiDialogOverlayCloseOnClick'],
    },
  ],
  host: {
    class: 'fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]',
    '[attr.data-ui]': "'dialog-overlay'",
  },
})
export class UiDialogOverlayDirective {}
