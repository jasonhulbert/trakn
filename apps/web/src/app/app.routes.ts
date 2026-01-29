import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { comingSoonGuard, comingSoonPageGuard } from './core/guards/coming-soon.guard';

export const routeTmpl = {
  Home: () => ``,
  Auth: () => `auth`,
  AuthLogin: () => `auth/login`,
  AuthRegister: () => `auth/register`,
  ComingSoon: () => `coming-soon`,
} as const;

export const routes: Routes = [
  {
    path: routeTmpl.ComingSoon(),
    canActivate: [comingSoonPageGuard],
    loadComponent: () => import('./features/coming-soon/coming-soon.component').then((m) => m.ComingSoonComponent),
  },
  {
    path: routeTmpl.Home(),
    canActivate: [comingSoonGuard, authGuard],
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: routeTmpl.Auth(),
    canActivate: [comingSoonGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
];
