import { Directive } from '@angular/core';

@Directive({
  selector: 'tbody[uiTableBody]',
  standalone: true,
  host: {
    class: 'bg-base-900',
    '[attr.data-ui]': "'table-body'",
  },
})
export class UiTableBodyDirective {}
