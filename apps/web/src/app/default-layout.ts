import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { LayoutHeader } from './shared/components/layout/layout-header/layout-header';
import { LayoutMain } from './shared/components/layout/layout-main/layout-main';
import { Navbar } from './shared/components';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, Layout, LayoutHeader, LayoutMain, Navbar],
  template: `
    <app-layout>
      <app-layout-header>
        <app-navbar></app-navbar>
      </app-layout-header>
      <app-layout-main>
        <router-outlet />
      </app-layout-main>
    </app-layout>
  `,
})
export class DefaultLayoutComponent {}
