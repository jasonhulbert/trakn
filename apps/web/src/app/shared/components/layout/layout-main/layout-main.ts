import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-main',
  imports: [],
  template: ` <ng-content></ng-content> `,
  host: {
    class: 'z-0 relative flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden',
  },
})
export class LayoutMain {}
