import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { maintenanceModeGuard, maintenanceModePageGuard } from './core/guards/maintenance.guard';

export const routeTmpl = {
  Home: () => ``,
  Auth: () => `auth`,
  AuthLogin: () => `auth/login`,
  AuthRegister: () => `auth/register`,
  Maintenance: () => `maintenance`,
} as const;

export const routes: Routes = [
  {
    path: routeTmpl.Maintenance(),
    canActivate: [maintenanceModePageGuard],
    loadComponent: () => import('./features/maintenance/maintenance.component').then((m) => m.MaintenanceComponent),
  },
  {
    path: routeTmpl.Home(),
    canActivate: [maintenanceModeGuard, authGuard],
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: routeTmpl.Auth(),
    canActivate: [maintenanceModeGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    canActivate: [maintenanceModeGuard],
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
];
