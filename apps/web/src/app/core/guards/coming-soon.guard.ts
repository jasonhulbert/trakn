import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const comingSoonGuard = () => {
  if (environment.maintenanceMode) {
    const router = inject(Router);
    return router.parseUrl('/coming-soon');
  }
  return true;
};

export const comingSoonPageGuard = () => {
  if (!environment.maintenanceMode) {
    const router = inject(Router);
    return router.parseUrl('/');
  }
  return true;
};
