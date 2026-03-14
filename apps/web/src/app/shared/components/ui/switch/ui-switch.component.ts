import { booleanAttribute, Component, input, linkedSignal, output } from '@angular/core';
import { NgpSwitch, NgpSwitchThumb } from 'ng-primitives/switch';
import { cx, UI_STYLES } from '../_internal';

@Component({
  selector: 'ui-switch',
  standalone: true,
  imports: [NgpSwitch, NgpSwitchThumb],
  template: `
    <button
      type="button"
      ngpSwitch
      [ngpSwitchChecked]="checkedState()"
      (ngpSwitchCheckedChange)="onCheckedChange($event)"
      [ngpSwitchDisabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [class]="trackClass()"
    >
      <span ngpSwitchThumb [class]="thumbClass()"></span>
    </button>
    <ng-content />
  `,
  host: {
    class: 'inline-flex items-center gap-2 align-middle',
    '[attr.data-ui]': "'switch'",
  },
})
export class UiSwitchComponent {
  checked = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  ariaLabel = input<string>('');

  checkedChange = output<boolean>();

  protected readonly checkedState = linkedSignal(() => this.checked());

  protected readonly trackClass = () =>
    cx(
      'inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5',
      'transition-colors',
      UI_STYLES.focusVisibleRing,
      UI_STYLES.disabled,
      this.checkedState() ? 'bg-primary-500' : 'bg-surface-300'
    );

  protected readonly thumbClass = () =>
    cx(
      'block h-5 w-5 rounded-full bg-white shadow-sm',
      'transition-transform',
      this.checkedState() ? 'translate-x-5' : 'translate-x-0'
    );

  protected onCheckedChange(value: boolean): void {
    this.checkedState.set(value);
    this.checkedChange.emit(value);
  }
}
