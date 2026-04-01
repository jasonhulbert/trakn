import { computed, Directive, input } from '@angular/core';
import { NgpButton } from 'ng-primitives/button';
import { cx, UI_STYLES } from '../_internal';
import type { UiButtonColor, UiButtonSize, UiButtonVariant } from './ui-button.types';

const SOLID_COLORS: Record<UiButtonColor, string> = {
  default: 'bg-base-700 text-fore-300 hover:bg-base-600 active:bg-base-500',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
};

const OUTLINE_COLORS: Record<UiButtonColor, string> = {
  default: 'border border-border text-fore-300 hover:bg-base-800 bg-transparent',
  accent: 'border-2 border-accent-500 text-accent-400 hover:bg-accent-950 bg-transparent',
  danger: 'border-2 border-danger-500 text-danger-400 hover:bg-danger-950 bg-transparent',
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
  readonly color = input<UiButtonColor>('default');
  readonly size = input<UiButtonSize>('md');

  protected readonly hostClass = computed(() =>
    cx(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors',
      UI_STYLES.focusVisibleRing,
      UI_STYLES.disabled,
      SIZE_CLASSES[this.size()],
      this.variant() === 'ghost'
        ? 'bg-transparent text-fore-300 hover:bg-base-800 active:bg-base-700'
        : this.variant() === 'outline'
          ? (OUTLINE_COLORS[this.color()] ?? OUTLINE_COLORS.default)
          : (SOLID_COLORS[this.color()] ?? SOLID_COLORS.default)
    )
  );
}
