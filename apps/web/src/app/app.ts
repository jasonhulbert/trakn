import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { LayoutHeader } from './shared/components/layout/layout-header/layout-header';
import { Navbar } from './shared/components';
import { LayoutMain } from './shared/components/layout/layout-main/layout-main';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout, LayoutHeader, Navbar, LayoutMain],
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
  styles: [],
})
export class App {
  protected readonly title = signal('trakn');
}
