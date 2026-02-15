import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import type { SyncOperation } from '@trkn-shared';

export interface UserProfileRow {
  user_id: string; // Primary key (auth user ID)
  age: number;
  weight: number;
  weight_unit: 'lbs' | 'kg';
  fitness_level: number; // 1-5
  physical_limitations?: string; // Optional
  updated_at: string; // ISO timestamp
}

export class TraknDatabase extends Dexie {
  // Tables
  syncQueue!: Table<SyncOperation, string>;
  userProfiles!: Table<UserProfileRow, string>;

  constructor() {
    super('TraknDB');

    this.version(1).stores({
      syncQueue: 'id, timestamp, type, table',
      userProfiles: 'user_id', // user_id is primary key
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

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfileRow | undefined> {
    return this.db.userProfiles.get(userId);
  }

  async saveUserProfile(profile: UserProfileRow): Promise<string> {
    return this.db.userProfiles.put(profile);
  }

  async deleteUserProfile(userId: string): Promise<void> {
    await this.db.userProfiles.delete(userId);
  }

  // Clear all data (useful for logout)
  async clearAllData(): Promise<void> {
    await this.db.delete();
    this.db = new TraknDatabase();
  }
}
