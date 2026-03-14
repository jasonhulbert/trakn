import { Directive } from '@angular/core';
import { NgpAccordionContent } from 'ng-primitives/accordion';

@Directive({
  selector: '[uiAccordionContent]',
  standalone: true,
  hostDirectives: [NgpAccordionContent],
  host: {
    class: 'px-4 pb-4 pt-1 text-sm text-surface-700',
    '[attr.data-ui]': "'accordion-content'",
  },
})
export class UiAccordionContentDirective {}
