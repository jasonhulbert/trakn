import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { routeTmpl } from 'src/app/app.routes';
import { environment } from '../../../environments/environment';

export const maintenanceModeGuard = () => {
  if (environment.maintenanceMode) {
    const router = inject(Router);
    return router.navigate([routeTmpl.Maintenance()]);
  }
  return true;
};

export const maintenanceModePageGuard = () => {
  if (!environment.maintenanceMode) {
    const router = inject(Router);
    return router.navigate([routeTmpl.Home()]);
  }
  return true;
};
