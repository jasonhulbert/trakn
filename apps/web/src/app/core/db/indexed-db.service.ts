import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import type { SyncOperation, WorkoutOutput, WorkoutInput } from '@trkn-shared';

export interface UserProfileRow {
  user_id: string; // Primary key (auth user ID)
  age: number;
  weight: number;
  weight_unit: 'lbs' | 'kg';
  fitness_level: number; // 1-5
  physical_limitations?: string; // Optional
  updated_at: string; // ISO timestamp
}

export interface WorkoutRow {
  id: string; // Primary key (UUID)
  user_id: string;
  workout_type: string;
  data: WorkoutOutput; // Full workout output JSON
  input: WorkoutInput; // Original input used for generation
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export class TraknDatabase extends Dexie {
  // Tables
  syncQueue!: Table<SyncOperation, string>;
  userProfiles!: Table<UserProfileRow, string>;
  workouts!: Table<WorkoutRow, string>;

  constructor() {
    super('TraknDB');

    this.version(1).stores({
      syncQueue: 'id, timestamp, type, table',
      userProfiles: 'user_id',
    });

    this.version(2).stores({
      syncQueue: 'id, timestamp, type, table',
      userProfiles: 'user_id',
      workouts: 'id, user_id, workout_type, created_at',
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

  // Workout operations
  async getWorkout(id: string): Promise<WorkoutRow | undefined> {
    return this.db.workouts.get(id);
  }

  async getWorkoutsByUser(userId: string): Promise<WorkoutRow[]> {
    return this.db.workouts.where('user_id').equals(userId).reverse().sortBy('created_at');
  }

  async saveWorkout(workout: WorkoutRow): Promise<string> {
    return this.db.workouts.put(workout);
  }

  async updateWorkout(id: string, changes: Partial<WorkoutRow>): Promise<void> {
    await this.db.workouts.update(id, changes);
  }

  async deleteWorkout(id: string): Promise<void> {
    await this.db.workouts.delete(id);
  }

  // Clear all data (useful for logout)
  async clearAllData(): Promise<void> {
    await this.db.delete();
    this.db = new TraknDatabase();
  }
}
