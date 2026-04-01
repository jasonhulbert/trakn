import { Directive } from '@angular/core';
import { NgpLabel } from 'ng-primitives/form-field';

@Directive({
  selector: 'label[uiLabel]',
  standalone: true,
  hostDirectives: [NgpLabel],
  host: {
    class: 'block text-sm font-medium text-fore-300',
    '[attr.data-ui]': "'label'",
  },
})
export class UiLabelDirective {}
