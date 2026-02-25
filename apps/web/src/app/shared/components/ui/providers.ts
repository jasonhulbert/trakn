import type { Provider } from '@angular/core';
import { provideDialogConfig } from 'ng-primitives/dialog';
import { provideToastConfig } from 'ng-primitives/toast';

/**
 * App-level overlay configuration for UI primitives.
 * Keep this intentionally small in Phase 2; component-level wrappers land in later phases.
 */
export const UI_OVERLAY_PROVIDERS: Provider[] = [
  ...provideDialogConfig({
    closeOnNavigation: true,
    closeOnEscape: true,
    closeOnClick: true,
    modal: true,
  }),
  ...provideToastConfig({
    offsetTop: 16,
    offsetBottom: 16,
    offsetLeft: 16,
    offsetRight: 16,
    gap: 8,
    maxToasts: 3,
    zIndex: 60,
  }),
];
