import { Directive } from '@angular/core';

@Directive({
  selector: 'tbody[uiTableBody]',
  standalone: true,
  host: {
    class: 'bg-white',
    '[attr.data-ui]': "'table-body'",
  },
})
export class UiTableBodyDirective {}
