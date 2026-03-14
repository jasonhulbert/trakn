import { Directive } from '@angular/core';

@Directive({
  selector: 'tr[uiTableRow]',
  standalone: true,
  host: {
    class: 'border-b border-surface-200 last:border-b-0',
    '[attr.data-ui]': "'table-row'",
  },
})
export class UiTableRowDirective {}
