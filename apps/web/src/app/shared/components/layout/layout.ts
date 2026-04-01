import { Component, input } from '@angular/core';

export enum LayoutPadding {
  None = 'none',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

@Component({
  selector: 'app-layout',
  template: `
    <ng-content select="app-layout-header"></ng-content>
    <ng-content select="app-layout-main"></ng-content>
  `,
  host: {
    class: 'flex flex-col w-full min-w-screen min-h-screen mx-auto bg-bg text-fg',
  },
})
export class Layout {
  contained = input(false);

  padding = input<LayoutPadding | `${LayoutPadding}`>(LayoutPadding.Medium);
}
