import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth initialization to complete
  await authService.waitForInitialization();

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/auth/login');
};

export const publicGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth initialization to complete
  await authService.waitForInitialization();

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/');
};
