import { inject, Injectable, signal } from '@angular/core';
import { IndexedDbService } from '../db/indexed-db.service';
import { SupabaseService } from './supabase.service';
import type { SyncOperation, SyncOperationData, SyncStatus } from '@trkn-shared';

@Injectable({
  providedIn: 'root',
})
export class OfflineSyncService {
  // Signals for reactive state
  isOnline = signal<boolean>(navigator.onLine);
  isSyncing = signal<boolean>(false);
  syncStatus = signal<SyncStatus>({
    pending: 0,
    synced: 0,
    failed: 0,
    lastSyncAt: null,
  });

  private syncInProgress = false;

  private readonly db = inject(IndexedDbService);
  private readonly supabase = inject(SupabaseService);

  constructor() {
    this.initializeOnlineListener();
    this.startPeriodicSync();
  }

  private initializeOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
    });
  }

  private startPeriodicSync() {
    // Sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline() && !this.syncInProgress) {
        this.processQueue();
      }
    }, 30000);
  }

  async queueOperation(type: 'create' | 'update' | 'delete', table: string, data: SyncOperationData): Promise<void> {
    const operation: SyncOperation = {
      id: crypto.randomUUID(),
      type,
      table,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    await this.db.addToSyncQueue(operation);

    // Update pending count
    const queue = await this.db.getSyncQueue();
    this.syncStatus.update((status) => ({
      ...status,
      pending: queue.length,
    }));

    // Try to sync immediately if online
    if (this.isOnline() && !this.syncInProgress) {
      this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline()) {
      return;
    }

    this.syncInProgress = true;
    this.isSyncing.set(true);

    try {
      const queue = await this.db.getSyncQueue();

      if (queue.length === 0) {
        this.syncInProgress = false;
        this.isSyncing.set(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const operation of queue) {
        try {
          await this.executeOperation(operation);
          await this.db.removeFromSyncQueue(operation.id);
          successCount++;
        } catch (error) {
          console.error('Sync operation failed:', error);
          failCount++;

          // Update retry count
          operation.retries++;

          if (operation.retries > 5) {
            // Too many retries, remove from queue and log
            console.error('Operation failed after 5 retries:', operation);
            await this.db.removeFromSyncQueue(operation.id);
            failCount++;
          }
        }
      }

      // Update sync status
      const remainingQueue = await this.db.getSyncQueue();
      this.syncStatus.set({
        pending: remainingQueue.length,
        synced: successCount,
        failed: failCount,
        lastSyncAt: new Date().toISOString(),
      });
    } finally {
      this.syncInProgress = false;
      this.isSyncing.set(false);
    }
  }

  private async executeOperation(operation: SyncOperation): Promise<void> {
    const { type, table, data } = operation;

    switch (type) {
      case 'create':
        await this.supabase.from(table).insert(data);
        break;
      case 'update':
        await this.supabase.from(table).update(data).eq('id', data.id);
        break;
      case 'delete':
        await this.supabase.from(table).delete().eq('id', data.id);
        break;
    }
  }

  async forceSyncNow(): Promise<void> {
    if (this.isOnline()) {
      await this.processQueue();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }
}
