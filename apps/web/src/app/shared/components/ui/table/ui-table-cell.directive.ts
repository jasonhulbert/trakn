import { Directive } from '@angular/core';

@Directive({
  selector: 'td[uiTableCell]',
  standalone: true,
  host: {
    class: 'px-4 py-2 align-middle text-sm text-surface-900',
    '[attr.data-ui]': "'table-cell'",
  },
})
export class UiTableCellDirective {}
