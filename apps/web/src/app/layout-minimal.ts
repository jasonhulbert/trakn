import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { LayoutMain } from './shared/components/layout/layout-main/layout-main';

@Component({
  selector: 'app-layout-minimal',
  imports: [RouterOutlet, Layout, LayoutMain],
  template: `
    <app-layout>
      <app-layout-main>
        <router-outlet />
      </app-layout-main>
    </app-layout>
  `,
})
export class LayoutMinimalComponent {}
