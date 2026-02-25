import { Injectable, inject } from '@angular/core';
import { NgpDialogManager } from 'ng-primitives/dialog';
import type { NgpDialogRef } from 'ng-primitives/dialog';

type UiDialogOpenTarget = Parameters<NgpDialogManager['open']>[0];
type UiDialogOpenConfig = Parameters<NgpDialogManager['open']>[1];

@Injectable({
  providedIn: 'root',
})
export class UiDialogService {
  private readonly dialogManager = inject(NgpDialogManager);

  open(target: UiDialogOpenTarget, config?: UiDialogOpenConfig): NgpDialogRef<unknown, unknown> {
    return this.dialogManager.open(target, config) as NgpDialogRef<unknown, unknown>;
  }

  closeAll(): void {
    this.dialogManager.closeAll();
  }

  getDialogById(id: string) {
    return this.dialogManager.getDialogById(id);
  }
}
