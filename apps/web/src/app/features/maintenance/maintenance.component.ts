import { Component } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  template: `
    <div class="flex items-center justify-center w-full bg-gray-50 py-8 px-4">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900">Trakn</h1>
          <p class="mt-4 text-lg text-gray-600">Coming Soon</p>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'block w-full max-w-md m-auto',
  },
})
export class MaintenanceComponent {}
