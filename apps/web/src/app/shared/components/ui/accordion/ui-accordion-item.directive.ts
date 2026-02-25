import { Directive } from '@angular/core';
import { NgpAccordionItem } from 'ng-primitives/accordion';

@Directive({
  selector: '[uiAccordionItem]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgpAccordionItem,
      inputs: ['ngpAccordionItemValue: uiAccordionItem', 'ngpAccordionItemDisabled: uiAccordionItemDisabled'],
    },
  ],
  host: {
    class: 'block',
    '[attr.data-ui]': "'accordion-item'",
  },
})
export class UiAccordionItemDirective {}
