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
          <p class="text-sm font-semibold text-gray-900">{{ context.title }}</p>
        }
        <p class="text-sm text-gray-700">{{ context.message }}</p>
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
    this.context.variant === 'success' && 'border-green-200',
    this.context.variant === 'success' && 'ring-1 ring-green-100',
    this.context.variant === 'error' && 'border-red-200',
    this.context.variant === 'error' && 'ring-1 ring-red-100',
    this.context.variant === 'warning' && 'border-amber-200',
    this.context.variant === 'warning' && 'ring-1 ring-amber-100',
    this.context.variant === 'info' && 'border-blue-200',
    this.context.variant === 'info' && 'ring-1 ring-blue-100'
  );
}
