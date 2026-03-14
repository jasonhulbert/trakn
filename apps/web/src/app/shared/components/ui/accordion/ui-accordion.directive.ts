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
    class: 'block divide-y divide-surface-200 overflow-hidden rounded-lg border border-surface-200 bg-white',
    '[attr.data-ui]': "'accordion'",
  },
})
export class UiAccordionDirective {}
