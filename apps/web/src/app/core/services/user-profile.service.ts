import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { UserProfile, UserProfileSchema } from '@trkn-shared';
import { SupabaseService } from './supabase.service';
import { IndexedDbService, type UserProfileRow } from '../db/indexed-db.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  profile = signal<UserProfile | null>(null);
  isLoading = signal<boolean>(true);
  hasProfile = computed(() => this.profile() !== null);

  private readonly supabase = inject(SupabaseService);
  private readonly indexedDb = inject(IndexedDbService);
  private readonly auth = inject(AuthService);

  constructor() {
    // Load profile when auth state changes
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.loadProfile();
      } else {
        this.profile.set(null);
        this.isLoading.set(false);
      }
    });
  }

  async loadProfile(): Promise<void> {
    this.isLoading.set(true);
    try {
      const userId = this.auth.currentUser()?.id;
      if (!userId) {
        throw new Error('No authenticated user');
      }

      // Try Supabase first
      const { data, error } = await this.supabase.from('user_profiles').select('*').eq('user_id', userId).single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - check IndexedDB cache
          const cached = await this.indexedDb.getUserProfile(userId);
          if (cached) {
            this.profile.set(this.mapRowToProfile(cached));
          } else {
            this.profile.set(null);
          }
        } else {
          throw error;
        }
      } else if (data) {
        const userProfile = this.mapRowToProfile(data);
        this.profile.set(userProfile);
        await this.syncToIndexedDb(userProfile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      // On error, try IndexedDB fallback
      const userId = this.auth.currentUser()?.id;
      if (userId) {
        const cached = await this.indexedDb.getUserProfile(userId);
        if (cached) {
          this.profile.set(this.mapRowToProfile(cached));
        }
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      throw new Error('No authenticated user');
    }

    // Validate with Zod schema
    const parsed = UserProfileSchema.parse(profile);

    const row: UserProfileRow = {
      user_id: userId,
      ...parsed,
      updated_at: new Date().toISOString(),
    };

    try {
      // Save to Supabase
      // Use onConflict to specify the unique constraint column for upsert
      const { error } = await this.supabase.from('user_profiles').upsert(row, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      // Update local state
      this.profile.set(parsed);
      await this.syncToIndexedDb(parsed);
    } catch (err) {
      // If offline, save to IndexedDB and sync queue
      await this.indexedDb.saveUserProfile(row);
      await this.indexedDb.addToSyncQueue({
        id: crypto.randomUUID(),
        type: 'update',
        table: 'user_profiles',
        data: { ...row, id: userId }, // Add id field for SyncOperationData
        timestamp: Date.now(),
        retries: 0,
      });
      this.profile.set(parsed);
      throw err; // Re-throw so component can show offline message
    }
  }

  private async syncToIndexedDb(profile: UserProfile): Promise<void> {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return;
    }

    const row: UserProfileRow = {
      user_id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    };
    await this.indexedDb.saveUserProfile(row);
  }

  private mapRowToProfile(row: UserProfileRow): UserProfile {
    return {
      age: row.age,
      weight: row.weight,
      weight_unit: row.weight_unit,
      fitness_level: row.fitness_level,
      physical_limitations: row.physical_limitations,
    };
  }
}
