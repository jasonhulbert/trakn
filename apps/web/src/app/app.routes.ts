import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routeTmpl = {
  Home: () => ``,
  Auth: () => `auth`,
  AuthLogin: () => `auth/login`,
  AuthRegister: () => `auth/register`,
} as const;

export const routes: Routes = [
  {
    path: routeTmpl.Home(),
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: routeTmpl.Auth(),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    redirectTo: routeTmpl.Home(),
  },
];
