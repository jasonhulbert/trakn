import { Routes } from '@angular/router';

export const guidelinesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./guidelines.component').then((m) => m.GuidelinesComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () => import('./pages/guidelines-overview.component').then((m) => m.GuidelinesOverviewComponent),
      },
      {
        path: 'colors',
        loadComponent: () => import('./pages/guidelines-colors.component').then((m) => m.GuidelinesColorsComponent),
      },
      {
        path: 'typography',
        loadComponent: () =>
          import('./pages/guidelines-typography.component').then((m) => m.GuidelinesTypographyComponent),
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./pages/guidelines-components.component').then((m) => m.GuidelinesComponentsComponent),
      },
    ],
  },
];
