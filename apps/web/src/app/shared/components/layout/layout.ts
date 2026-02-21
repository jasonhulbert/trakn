import { NgClass } from '@angular/common';
import { Component, HostBinding, input } from '@angular/core';

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
    class: 'flex flex-col w-full min-h-screen mx-auto',
  },
})
export class Layout {
  @HostBinding('class')
  protected readonly class = 'block min-w-screen min-h-screen bg-gray-50';

  contained = input(false);

  padding = input<LayoutPadding | `${LayoutPadding}`>(LayoutPadding.Medium);
}
