import { Component } from '@angular/core';

@Component({
  selector: 'ui-pattern-hero',
  standalone: true,
  template: `
    <svg viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <!-- Large partial circles — right side -->
      <circle cx="900" cy="200" r="280" stroke="#FF9500" stroke-width="2" opacity=".12" />
      <circle cx="900" cy="200" r="180" stroke="#FF9500" stroke-width="1" opacity=".06" />

      <!-- Vertical lines — left side -->
      <line x1="200" y1="0" x2="200" y2="400" stroke="#F5F0E4" stroke-width="1" opacity=".06" />
      <line x1="400" y1="0" x2="400" y2="400" stroke="#F5F0E4" stroke-width="1" opacity=".06" />
      <line x1="600" y1="0" x2="600" y2="400" stroke="#F5F0E4" stroke-width="1" opacity=".06" />

      <!-- Horizontal center line -->
      <line x1="0" y1="200" x2="1200" y2="200" stroke="#F5F0E4" stroke-width="1" opacity=".04" />

      <!-- Intersection accent marks -->
      <rect x="196" y="196" width="8" height="8" fill="#FF9500" opacity=".2" />
      <rect x="396" y="196" width="8" height="8" fill="#FF9500" opacity=".15" />
      <rect x="596" y="196" width="8" height="8" fill="#FF9500" opacity=".1" />
    </svg>
  `,
  host: {
    '[class]': 'hostClass',
    '[attr.data-ui]': "'pattern-hero'",
  },
})
export class UiPatternHeroComponent {
  protected readonly hostClass = 'block pointer-events-none overflow-hidden';
}
