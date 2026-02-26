import { Directive } from '@angular/core';
import { NgpAccordionTrigger } from 'ng-primitives/accordion';

@Directive({
  selector: 'button[uiAccordionTrigger]',
  standalone: true,
  hostDirectives: [NgpAccordionTrigger],
  host: {
    class:
      'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    '[attr.data-ui]': "'accordion-trigger'",
    type: 'button',
  },
})
export class UiAccordionTriggerDirective {}
