import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  imports: [],
  template: ` <ng-content></ng-content> `,
  host: {
    class: 'block sticky inset-0 bottom-auto w-full shrink',
  },
})
export class LayoutHeader {}
