import { Directive } from '@angular/core';

@Directive({
  selector: '[uiCardBody]',
  standalone: true,
  host: {
    class: 'px-4 py-4',
    '[attr.data-ui]': "'card-body'",
  },
})
export class UiCardBodyDirective {}
