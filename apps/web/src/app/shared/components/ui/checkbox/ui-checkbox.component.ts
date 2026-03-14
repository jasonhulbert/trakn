import { booleanAttribute, Component, input, linkedSignal, output } from '@angular/core';
import { NgpCheckbox } from 'ng-primitives/checkbox';
import { cx, UI_STYLES } from '../_internal';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [NgpCheckbox],
  template: `
    <button
      type="button"
      ngpCheckbox
      [ngpCheckboxChecked]="checkedState()"
      (ngpCheckboxCheckedChange)="onCheckedChange($event)"
      [ngpCheckboxIndeterminate]="indeterminateState()"
      (ngpCheckboxIndeterminateChange)="onIndeterminateChange($event)"
      [ngpCheckboxRequired]="required()"
      [ngpCheckboxDisabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [class]="buttonClass()"
    >
      <span [class]="indicatorClass()">
        @if (indeterminateState()) {
          <span class="block h-0.5 w-2 rounded-full bg-white"></span>
        } @else if (checkedState()) {
          <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 text-white" aria-hidden="true">
            <path fill="currentColor" d="M6.3 11.2 3.6 8.5l-1 1 3.7 3.7 7-7-1-1-6 6Z" />
          </svg>
        }
      </span>
    </button>
    <ng-content />
  `,
  host: {
    class: 'inline-flex items-center gap-2 align-middle',
    '[attr.data-ui]': "'checkbox'",
  },
})
export class UiCheckboxComponent {
  checked = input(false, { transform: booleanAttribute });
  indeterminate = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  required = input(false, { transform: booleanAttribute });
  ariaLabel = input<string>('');

  checkedChange = output<boolean>();
  indeterminateChange = output<boolean>();

  protected readonly checkedState = linkedSignal(() => this.checked());
  protected readonly indeterminateState = linkedSignal(() => this.indeterminate());

  protected readonly buttonClass = () =>
    cx(
      'inline-flex h-5 w-5 shrink-0 items-center justify-center',
      UI_STYLES.borderBase,
      'bg-white text-white transition-colors',
      UI_STYLES.radiusMd,
      UI_STYLES.focusVisibleRing,
      UI_STYLES.disabled,
      (this.checkedState() || this.indeterminateState()) && 'border-primary-500 bg-primary-500'
    );

  protected readonly indicatorClass = () =>
    cx(
      'flex h-full w-full items-center justify-center',
      !(this.checkedState() || this.indeterminateState()) && 'opacity-0'
    );

  protected onCheckedChange(value: boolean): void {
    this.checkedState.set(value);

    if (value && this.indeterminateState()) {
      this.indeterminateState.set(false);
      this.indeterminateChange.emit(false);
    }

    this.checkedChange.emit(value);
  }

  protected onIndeterminateChange(value: boolean): void {
    this.indeterminateState.set(value);
    this.indeterminateChange.emit(value);
  }
}
