import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom, filter, take } from 'rxjs';
import type { UserProfile } from '@trkn-shared';
import { UserProfileService } from '../services/user-profile.service';

/**
 * Resolver that ensures the user's profile is loaded before activating the profile route.
 * This prevents race conditions where the component tries to read the profile before it's loaded.
 *
 * @returns The loaded user profile or null if no profile exists
 */
export const profileResolver: ResolveFn<UserProfile | null> = async () => {
  const userProfileService = inject(UserProfileService);

  // Wait for the profile service to finish loading
  // The service automatically loads the profile via effect() when user is authenticated
  await firstValueFrom(
    toObservable(userProfileService.isLoading).pipe(
      filter((loading) => !loading),
      take(1)
    )
  );

  // Return the loaded profile (or null if none exists)
  return userProfileService.profile();
};
