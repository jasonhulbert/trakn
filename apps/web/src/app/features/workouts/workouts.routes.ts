import { Routes } from '@angular/router';

export const workoutsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./workouts.component').then((m) => m.WorkoutsComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./workout-detail.component').then((m) => m.WorkoutDetailComponent),
  },
];
