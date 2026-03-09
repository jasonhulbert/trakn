import { Directive } from '@angular/core';

@Directive({
  selector: '[uiCardFooter]',
  standalone: true,
  host: {
    class: 'flex items-center px-4 py-3 border-t border-gray-200',
    '[attr.data-ui]': "'card-footer'",
  },
})
export class UiCardFooterDirective {}
