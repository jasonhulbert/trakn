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
          <p class="text-sm font-semibold text-surface-900">{{ context.title }}</p>
        }
        <p class="text-sm text-surface-700">{{ context.message }}</p>
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
    'bg-white/95',
    this.context.variant === 'success' && 'border-success-200',
    this.context.variant === 'success' && 'ring-1 ring-success-100',
    this.context.variant === 'error' && 'border-danger-200',
    this.context.variant === 'error' && 'ring-1 ring-danger-100',
    this.context.variant === 'warning' && 'border-warning-200',
    this.context.variant === 'warning' && 'ring-1 ring-warning-100',
    this.context.variant === 'info' && 'border-info-200',
    this.context.variant === 'info' && 'ring-1 ring-info-100'
  );
}
