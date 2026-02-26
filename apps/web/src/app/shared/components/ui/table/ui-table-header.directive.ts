import { Directive } from '@angular/core';

@Directive({
  selector: 'thead[uiTableHeader]',
  standalone: true,
  host: {
    class: 'bg-gray-50',
    '[attr.data-ui]': "'table-header'",
  },
})
export class UiTableHeaderDirective {}
