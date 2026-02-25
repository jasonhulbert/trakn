import { Directive } from '@angular/core';
import { NgpDialogTrigger } from 'ng-primitives/dialog';

@Directive({
  selector: '[uiDialogTrigger]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgpDialogTrigger,
      inputs: ['ngpDialogTrigger: uiDialogTrigger', 'ngpDialogTriggerCloseOnEscape: uiDialogTriggerCloseOnEscape'],
      outputs: ['ngpDialogTriggerClosed: uiDialogTriggerClosed'],
    },
  ],
  host: {
    '[attr.data-ui]': "'dialog-trigger'",
  },
})
export class UiDialogTriggerDirective {}
