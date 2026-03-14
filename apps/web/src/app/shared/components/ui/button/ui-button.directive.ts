import { computed, Directive, input } from '@angular/core';
import { NgpButton } from 'ng-primitives/button';
import { cx, UI_STYLES } from '../_internal';
import type { UiButtonColor, UiButtonSize, UiButtonVariant } from './ui-button.types';

const SOLID_COLORS: Record<UiButtonColor, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
  cyan: 'bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700',
  violet: 'bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700',
  rose: 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700',
  surface: 'bg-surface-100 text-surface-700 hover:bg-surface-200 active:bg-surface-300',
};

const OUTLINE_COLORS: Record<UiButtonColor, string> = {
  primary: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 bg-transparent',
  danger: 'border-2 border-danger-500 text-danger-600 hover:bg-danger-50 bg-transparent',
  cyan: 'border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50 bg-transparent',
  violet: 'border-2 border-violet-400 text-violet-600 hover:bg-violet-50 bg-transparent',
  rose: 'border-2 border-rose-400 text-rose-600 hover:bg-rose-50 bg-transparent',
  surface: 'border-2 border-surface-300 text-surface-700 hover:bg-surface-50 bg-transparent',
};

const SIZE_CLASSES: Record<UiButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

@Directive({
  selector: 'button[uiButton], a[uiButton]',
  standalone: true,
  hostDirectives: [NgpButton],
  host: {
    '[class]': 'hostClass()',
    '[attr.data-ui]': "'button'",
    '[attr.data-variant]': 'variant()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
  },
})
export class UiButtonDirective {
  readonly variant = input<UiButtonVariant>('solid');
  readonly color = input<UiButtonColor>('primary');
  readonly size = input<UiButtonSize>('md');

  protected readonly hostClass = computed(() =>
    cx(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors',
      UI_STYLES.focusVisibleRing,
      UI_STYLES.disabled,
      SIZE_CLASSES[this.size()],
      this.variant() === 'ghost'
        ? 'bg-surface-100 text-surface-700 hover:bg-surface-200 active:bg-surface-300'
        : this.variant() === 'outline'
          ? (OUTLINE_COLORS[this.color()] ?? OUTLINE_COLORS.primary)
          : (SOLID_COLORS[this.color()] ?? SOLID_COLORS.primary)
    )
  );
}
