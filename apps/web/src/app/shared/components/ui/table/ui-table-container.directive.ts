import { Directive } from '@angular/core';

@Directive({
  selector: 'div[uiTableContainer]',
  standalone: true,
  host: {
    class: 'w-full overflow-x-auto',
    '[attr.data-ui]': "'table-container'",
  },
})
export class UiTableContainerDirective {}
