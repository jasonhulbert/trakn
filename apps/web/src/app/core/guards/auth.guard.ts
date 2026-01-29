import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Wait for auth initialization to complete
    await authService.waitForInitialization();
  } catch (error) {
    // Log initialization error but don't block navigation
    console.error('Auth initialization failed:', error);
    // Treat failed initialization as unauthenticated
    return router.parseUrl('/auth/login');
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/auth/login');
};

export const publicGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Wait for auth initialization to complete
    await authService.waitForInitialization();
  } catch (error) {
    // Log initialization error but don't block navigation
    console.error('Auth initialization failed:', error);
    // Treat failed initialization as unauthenticated, allow access to public routes
    return true;
  }

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/');
};
