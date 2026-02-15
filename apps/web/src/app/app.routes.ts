import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { maintenanceModeGuard, maintenanceModePageGuard } from './core/guards/maintenance.guard';
import { profileGuard } from './core/guards/profile.guard';

export const routeTmpl = {
  Home: () => ``,
  Auth: () => `auth`,
  AuthLogin: () => `auth/login`,
  AuthRegister: () => `auth/register`,
  Maintenance: () => `maintenance`,
  Profile: () => `profile`,
  NewWorkout: () => `workouts/new`,
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
    path: routeTmpl.Profile(),
    canActivate: [maintenanceModeGuard, authGuard],
    resolve: {
      profile: () => import('./core/resolvers/profile.resolver').then((m) => m.profileResolver),
    },
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: routeTmpl.NewWorkout(),
    canActivate: [maintenanceModeGuard, authGuard, profileGuard],
    loadChildren: () => import('./features/new-workout/new-workout.routes').then((m) => m.newWorkoutRoutes),
  },
  {
    path: '**',
    canActivate: [maintenanceModeGuard],
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
];
