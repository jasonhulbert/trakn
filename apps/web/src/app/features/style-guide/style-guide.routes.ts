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
      {
        path: 'spacing',
        loadComponent: () => import('./pages/style-guide-spacing.component').then((m) => m.StyleGuideSpacingComponent),
      },
      {
        path: 'iconography',
        loadComponent: () =>
          import('./pages/style-guide-iconography.component').then((m) => m.StyleGuideIconographyComponent),
      },
      {
        path: 'forms',
        loadComponent: () => import('./pages/style-guide-forms.component').then((m) => m.StyleGuideFormsComponent),
      },
      {
        path: 'animation',
        loadComponent: () =>
          import('./pages/style-guide-animation.component').then((m) => m.StyleGuideAnimationComponent),
      },
    ],
  },
];
