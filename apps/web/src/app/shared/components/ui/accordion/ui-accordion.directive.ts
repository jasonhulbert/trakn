import { Directive } from '@angular/core';
import { NgpAccordion } from 'ng-primitives/accordion';

@Directive({
  selector: '[uiAccordion]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgpAccordion,
      inputs: [
        'ngpAccordionType: uiAccordionType',
        'ngpAccordionCollapsible: uiAccordionCollapsible',
        'ngpAccordionValue: uiAccordionValue',
        'ngpAccordionDisabled: uiAccordionDisabled',
        'ngpAccordionOrientation: uiAccordionOrientation',
      ],
      outputs: ['ngpAccordionValueChange: uiAccordionValueChange'],
    },
  ],
  host: {
    class: 'block divide-y divide-base-700 overflow-hidden rounded-lg border border-border bg-base-900',
    '[attr.data-ui]': "'accordion'",
  },
})
export class UiAccordionDirective {}
