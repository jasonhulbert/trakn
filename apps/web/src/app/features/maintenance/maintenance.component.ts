import { Component } from '@angular/core';
import { UiPatternHeroComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [UiPatternHeroComponent],
  template: `
    <div class="relative h-64 overflow-hidden">
      <ui-pattern-hero class="absolute inset-0" />
      <div class="relative z-10 flex items-center justify-center h-full">
        <div class="text-center space-y-4">
          <h1 class="text-4xl font-extrabold text-fore-300 tracking-wide uppercase">Trakn</h1>
          <p class="text-lg text-fore-600">Coming Soon</p>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'block w-full max-w-md m-auto',
  },
})
export class MaintenanceComponent {}
