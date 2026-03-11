import { Routes } from '@angular/router';

export const styleGuideRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./style-guide.component').then((m) => m.StyleGuideComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/style-guide-overview.component').then((m) => m.StyleGuideOverviewComponent),
      },
      {
        path: 'colors',
        loadComponent: () => import('./pages/style-guide-colors.component').then((m) => m.StyleGuideColorsComponent),
      },
      {
        path: 'typography',
        loadComponent: () =>
          import('./pages/style-guide-typography.component').then((m) => m.StyleGuideTypographyComponent),
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./pages/style-guide-components.component').then((m) => m.StyleGuideComponentsComponent),
      },
    ],
  },
];
