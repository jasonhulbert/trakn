import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import type { SyncOperation } from '@trakn/shared';

export class TraknDatabase extends Dexie {
  // Tables
  syncQueue!: Table<SyncOperation, string>;

  constructor() {
    super('TraknDB');

    this.version(1).stores({
      syncQueue: 'id, timestamp, type, table',
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db: TraknDatabase;

  constructor() {
    this.db = new TraknDatabase();
  }

  get database(): TraknDatabase {
    return this.db;
  }

  // Sync queue operations
  async addToSyncQueue(operation: SyncOperation): Promise<string> {
    return this.db.syncQueue.put(operation);
  }

  async getSyncQueue(): Promise<SyncOperation[]> {
    return this.db.syncQueue.orderBy('timestamp').toArray();
  }

  async removeFromSyncQueue(id: string): Promise<void> {
    await this.db.syncQueue.delete(id);
  }

  async clearSyncQueue(): Promise<void> {
    await this.db.syncQueue.clear();
  }

  // Clear all data (useful for logout)
  async clearAllData(): Promise<void> {
    await this.db.delete();
    this.db = new TraknDatabase();
  }
}
