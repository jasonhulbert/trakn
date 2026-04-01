import { Component } from '@angular/core';

@Component({
  selector: 'ui-pattern-divider',
  standalone: true,
  template: `
    <div class="flex items-center gap-3">
      <div class="flex-1 h-px bg-base-700"></div>
      <div class="w-1.5 h-1.5 rotate-45 border border-fore-700"></div>
      <div class="flex-1 h-px bg-base-700"></div>
    </div>
  `,
  host: {
    role: 'separator',
    '[class]': 'hostClass',
    '[attr.data-ui]': "'pattern-divider'",
  },
})
export class UiPatternDividerComponent {
  protected readonly hostClass = 'block py-1';
}
