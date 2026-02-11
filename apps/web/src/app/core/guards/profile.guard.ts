import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom, filter, take, timeout } from 'rxjs';
import { UserProfileService } from '../services/user-profile.service';
import { AuthService } from '../services/auth.service';

export const profileGuard: CanActivateFn = async () => {
  const userProfileService = inject(UserProfileService);
  const router = inject(Router);
  const authService = inject(AuthService);

  // Wait for auth initialization
  await authService.waitForInitialization();

  // Wait for profile service to finish loading (reactive approach)
  try {
    await firstValueFrom(
      toObservable(userProfileService.isLoading).pipe(
        filter((loading) => !loading),
        take(1),
        timeout(10000) // 10 second timeout
      )
    );
  } catch (err) {
    console.error('Profile guard timeout or error:', err);
    // On timeout, redirect to profile page to be safe
    return router.createUrlTree(['/profile']);
  }

  if (userProfileService.hasProfile()) {
    return true;
  } else {
    return router.createUrlTree(['/profile']);
  }
};
