import { Directive } from '@angular/core';

@Directive({
  selector: 'table[uiTable]',
  standalone: true,
  host: {
    class: 'min-w-full caption-bottom text-sm',
    '[attr.data-ui]': "'table'",
  },
})
export class UiTableDirective {}
