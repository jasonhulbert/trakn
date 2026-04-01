import type { NgpToastOptions, NgpToastRef } from 'ng-primitives/toast';

export type UiToastVariant = 'default' | 'error';

export interface UiToastContext {
  title?: string;
  message: string;
  variant: UiToastVariant;
}

export interface UiToastShowOptions extends Omit<NgpToastOptions<UiToastContext>, 'context'> {
  title?: string;
  message: string;
  variant?: UiToastVariant;
}

export type UiToastHandle = NgpToastRef;
