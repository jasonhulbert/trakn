import { Injectable, inject } from '@angular/core';
import { NgpToastManager } from 'ng-primitives/toast';
import { UiToastComponent } from './ui-toast.component';
import type { UiToastHandle, UiToastShowOptions, UiToastVariant } from './ui-toast.types';

@Injectable({
  providedIn: 'root',
})
export class UiToastService {
  private readonly toastManager = inject(NgpToastManager);

  show(options: UiToastShowOptions): UiToastHandle {
    return this.toastManager.show(UiToastComponent, {
      placement: options.placement,
      duration: options.duration,
      dismissible: options.dismissible,
      swipeDirections: options.swipeDirections,
      sequential: options.sequential,
      context: {
        title: options.title,
        message: options.message,
        variant: options.variant ?? 'info',
      },
    });
  }

  info(message: string, title?: string): UiToastHandle {
    return this.show({ message, title, variant: 'info' });
  }

  success(message: string, title?: string): UiToastHandle {
    return this.show({ message, title, variant: 'success' });
  }

  warning(message: string, title?: string): UiToastHandle {
    return this.show({ message, title, variant: 'warning' });
  }

  error(message: string, title?: string): UiToastHandle {
    return this.show({ message, title, variant: 'error' });
  }

  showVariant(variant: UiToastVariant, message: string, title?: string): UiToastHandle {
    return this.show({ message, title, variant });
  }
}
