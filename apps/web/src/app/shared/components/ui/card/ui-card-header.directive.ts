import { Directive } from '@angular/core';

@Directive({
  selector: '[uiCardHeader]',
  standalone: true,
  host: {
    class: 'flex items-center justify-between px-4 py-3 border-b border-gray-200',
    '[attr.data-ui]': "'card-header'",
  },
})
export class UiCardHeaderDirective {}
