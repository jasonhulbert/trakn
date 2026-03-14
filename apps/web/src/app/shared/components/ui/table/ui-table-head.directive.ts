import { Directive } from '@angular/core';

@Directive({
  selector: 'th[uiTableHead]',
  standalone: true,
  host: {
    class: 'px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-surface-500',
    '[attr.data-ui]': "'table-head'",
  },
})
export class UiTableHeadDirective {}
