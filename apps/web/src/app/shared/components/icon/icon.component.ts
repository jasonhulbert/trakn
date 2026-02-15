import { Component, effect, inject, input, signal } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IconService, IconVariant } from '../../services/icon.service';

@Component({
  selector: 'app-icon',
  host: {
    style: 'display:inline-flex;line-height:0',
  },
  template: `@if (svg()) {
    <span [innerHTML]="svg()"></span>
  }`,
  styles: `
    span {
      display: contents;
    }
  `,
})
export class IconComponent {
  private readonly iconService = inject(IconService);

  name = input.required<string>();
  variant = input<IconVariant>('regular');

  protected readonly svg = signal<SafeHtml | null>(null);

  private loadToken = 0;

  constructor() {
    effect(() => {
      const name = this.name();
      const variant = this.variant();
      const token = ++this.loadToken;
      this.iconService.load(name, variant).then((result) => {
        if (token === this.loadToken) this.svg.set(result);
      });
    });
  }
}
