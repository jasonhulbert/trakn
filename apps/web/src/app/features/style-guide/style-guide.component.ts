import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-surface-50">
      <!-- Sidebar -->
      <aside class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-surface-200 bg-white">
        <div class="flex-1 flex flex-col overflow-y-auto">
          <!-- Logo / Title -->
          <div class="px-6 py-6 border-b border-surface-200">
            <span class="text-2xl font-extrabold tracking-tight text-surface-900">trakn</span>
            <span class="ml-1.5 text-xs font-medium text-surface-400 uppercase tracking-widest">style guide</span>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-3 py-4 space-y-1">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-primary-50 text-primary-700 font-semibold"
                [routerLinkActiveOptions]="{ exact: false }"
                class="flex items-center px-3 py-2.5 text-sm font-medium text-surface-600 rounded-lg hover:bg-surface-100 hover:text-surface-900 transition-colors"
              >
                {{ link.label }}
              </a>
            }
          </nav>
        </div>
      </aside>

      <!-- Mobile header -->
      <div class="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-surface-200">
        <div class="px-4 py-3 flex items-center gap-3">
          <span class="text-lg font-extrabold tracking-tight text-surface-900">trakn</span>
          <span class="text-xs font-medium text-surface-400 uppercase tracking-widest">style guide</span>
        </div>
        <nav class="px-3 pb-3 flex gap-1 overflow-x-auto">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="bg-primary-50 text-primary-700 font-semibold"
              [routerLinkActiveOptions]="{ exact: false }"
              class="shrink-0 px-3 py-1.5 text-sm font-medium text-surface-600 rounded-lg hover:bg-surface-100 transition-colors"
            >
              {{ link.label }}
            </a>
          }
        </nav>
      </div>

      <!-- Main content -->
      <main class="flex-1 md:ml-64">
        <div class="max-w-5xl mx-auto px-6 py-10 md:px-10 md:py-12 mt-24 md:mt-0">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class StyleGuideComponent {
  readonly navLinks = [
    { path: 'overview', label: 'Overview' },
    { path: 'colors', label: 'Colors' },
    { path: 'typography', label: 'Typography' },
    { path: 'spacing', label: 'Spacing' },
    { path: 'iconography', label: 'Iconography' },
    { path: 'components', label: 'Components' },
    { path: 'forms', label: 'Forms' },
    { path: 'animation', label: 'Animation' },
  ];
}
