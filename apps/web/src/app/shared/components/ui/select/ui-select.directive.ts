import { Directive } from '@angular/core';
import { NgpNativeSelect } from 'ng-primitives/select';
import { cx, UI_STYLES } from '../_internal';

@Directive({
  selector: 'select[uiSelect]',
  standalone: true,
  hostDirectives: [NgpNativeSelect],
  host: {
    '[class]': 'hostClass',
    '[attr.data-ui]': "'select'",
  },
})
export class UiSelectDirective {
  protected readonly hostClass = cx(
    UI_STYLES.inputBase,
    UI_STYLES.inputInteractive,
    UI_STYLES.disabled,
    UI_STYLES.textBody,
    // Opt into customizable select on supporting browsers
    'supports-base-select:[appearance:base-select]',
    // Picker panel — appearance opt-in + base styles
    'supports-base-select:[&::picker(select)]:[appearance:base-select]',
    'supports-base-select:[&::picker(select)]:bg-white',
    'supports-base-select:[&::picker(select)]:border',
    'supports-base-select:[&::picker(select)]:border-surface-200',
    'supports-base-select:[&::picker(select)]:rounded-md',
    'supports-base-select:[&::picker(select)]:p-1',
    'supports-base-select:[&::picker(select)]:shadow-lg',
    'supports-base-select:[&::picker(select)]:[min-width:anchor-size(width)]',
    'supports-base-select:[&::picker(select)]:[transform-origin:top]',
    // Picker icon — dropdown chevron
    'supports-base-select:[&::picker-icon]:text-surface-400',
    'supports-base-select:[&::picker-icon]:[transition:rotate_200ms_ease-out]',
    'supports-base-select:[&:open::picker-icon]:[rotate:180deg]',
    // Options — base styles
    'supports-base-select:[&_option]:px-2.5',
    'supports-base-select:[&_option]:py-1.5',
    'supports-base-select:[&_option]:rounded-sm',
    'supports-base-select:[&_option]:cursor-pointer',
    'supports-base-select:[&_option]:text-sm',
    'supports-base-select:[&_option]:text-surface-800',
    // Options — hover + selected states
    'supports-base-select:[&_option:hover]:bg-surface-100',
    'supports-base-select:[&_option:checked]:bg-primary-50',
    'supports-base-select:[&_option:checked]:text-primary-700',
    'supports-base-select:[&_option:checked]:font-medium'
  );
}
