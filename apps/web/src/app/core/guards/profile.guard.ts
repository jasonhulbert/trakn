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

  // IMPORTANT: toObservable() must be called synchronously within injection context
  // Create the observables before any async operations
  const isLoading$ = toObservable(userProfileService.isLoading);
  const authIsLoading$ = toObservable(authService.isLoading);
  const isAuthenticated$ = toObservable(authService.isAuthenticated);

  // Wait for auth initialization
  await authService.waitForInitialization();

  // Wait for both auth and profile to finish loading
  try {
    // First, ensure auth is stable and user is authenticated
    await firstValueFrom(
      authIsLoading$.pipe(
        filter((loading) => !loading),
        take(1),
        timeout(5000)
      )
    );

    // Verify user is still authenticated after auth stabilizes
    const authenticated = await firstValueFrom(isAuthenticated$.pipe(take(1)));
    if (!authenticated) {
      // User is not authenticated, let authGuard handle this
      return true;
    }

    // Wait for profile service to finish loading
    await firstValueFrom(
      isLoading$.pipe(
        filter((loading) => !loading),
        take(1),
        timeout(10000)
      )
    );
  } catch (err) {
    console.error('Profile guard timeout or error:', err);
    // On timeout, allow navigation and let the user see a loading state in the component
    // This is better than redirecting away from their current page
    return true;
  }

  if (userProfileService.hasProfile()) {
    return true;
  } else {
    return router.createUrlTree(['/profile']);
  }
};
