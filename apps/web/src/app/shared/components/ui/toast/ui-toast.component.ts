import { Component } from '@angular/core';
import { NgpToast, injectToastContext } from 'ng-primitives/toast';
import { cx } from '../_internal';
import type { UiToastContext } from './ui-toast.types';

@Component({
  selector: 'ui-toast',
  standalone: true,
  hostDirectives: [NgpToast],
  template: `
    <div [class]="containerClass">
      <div class="min-w-0">
        @if (context.title) {
          <p class="text-sm font-semibold text-fore-200">{{ context.title }}</p>
        }
        <p class="text-sm text-fore-400">{{ context.message }}</p>
      </div>
    </div>
  `,
  host: {
    '[attr.data-ui]': "'toast'",
    class: 'pointer-events-auto w-[min(24rem,calc(100vw-2rem))]',
  },
})
export class UiToastComponent {
  protected readonly context = injectToastContext<UiToastContext>();

  protected readonly containerClass = cx(
    'rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm',
    'bg-base-800/95',
    this.context.variant === 'default' && 'border-border',
    this.context.variant === 'error' && 'border-danger-500',
    this.context.variant === 'error' && 'ring-1 ring-danger-900'
  );
}
