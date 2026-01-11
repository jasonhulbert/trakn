import { Routes } from '@angular/router';
import { publicGuard } from '../../core/guards/auth.guard';

export const authRoutesTmpl = {
  Login: () => `login`,
  Register: () => `register`,
} as const;

export const authRoutes: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
