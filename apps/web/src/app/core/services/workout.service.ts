import { Injectable, inject, signal, computed, effect } from '@angular/core';
import type { WorkoutInput, WorkoutOutput, ConditioningOutput } from '@trkn-shared';
import { ApiService } from './api.service';
import { UserProfileService } from './user-profile.service';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { IndexedDbService, type WorkoutRow } from '../db/indexed-db.service';
import { firstValueFrom } from 'rxjs';

export type WorkoutFlowStep = 'type-selection' | 'params' | 'generating' | 'results';

export interface WorkoutFormState {
  step: WorkoutFlowStep;
  selectedType: WorkoutInput['workout_type'] | null;
  params: Partial<WorkoutInput> | null;
  generatedWorkout: WorkoutOutput | null;
  originalInput: WorkoutInput | null;
  error: string | null;
}

const WORKOUT_STATE_KEY = 'trakn_workout_state';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly api = inject(ApiService);
  private readonly userProfile = inject(UserProfileService);
  private readonly auth = inject(AuthService);
  private readonly supabase = inject(SupabaseService);
  private readonly indexedDb = inject(IndexedDbService);

  // Workout generation flow state
  private readonly formState = signal<WorkoutFormState>(this.loadStateFromSession());

  // Public read-only signals
  readonly step = computed(() => this.formState().step);
  readonly selectedType = computed(() => this.formState().selectedType);
  readonly params = computed(() => this.formState().params);
  readonly generatedWorkout = computed(() => this.formState().generatedWorkout);
  readonly originalInput = computed(() => this.formState().originalInput);
  readonly error = computed(() => this.formState().error);
  readonly isGenerating = computed(() => this.formState().step === 'generating');
  readonly hasWorkout = computed(() => this.formState().generatedWorkout !== null);

  // Phase 5: Revision and save state
  readonly isSaving = signal(false);
  readonly isRevising = signal(false);
  readonly revisingExerciseIndex = signal<number | null>(null);
  readonly revisingIntervalIndex = signal<number | null>(null);
  readonly savedWorkoutId = signal<string | null>(null);

  constructor() {
    // Persist state to sessionStorage whenever it changes
    effect(() => {
      const state = this.formState();
      this.saveStateToSession(state);
    });
  }

  private loadStateFromSession(): WorkoutFormState {
    try {
      const saved = sessionStorage.getItem(WORKOUT_STATE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load workout state from session:', err);
    }
    return {
      step: 'type-selection',
      selectedType: null,
      params: null,
      generatedWorkout: null,
      originalInput: null,
      error: null,
    };
  }

  private saveStateToSession(state: WorkoutFormState): void {
    try {
      sessionStorage.setItem(WORKOUT_STATE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save workout state to session:', err);
    }
  }

  /**
   * Select a workout type and advance to the params step
   */
  selectWorkoutType(type: WorkoutInput['workout_type']): void {
    this.formState.update((state) => ({
      ...state,
      selectedType: type,
      step: 'params',
      error: null,
    }));
  }

  /**
   * Go back to the previous step
   */
  goBack(): void {
    const currentStep = this.step();
    if (currentStep === 'params') {
      this.formState.update((state) => ({
        ...state,
        step: 'type-selection',
        error: null,
      }));
    } else if (currentStep === 'results') {
      this.formState.update((state) => ({
        ...state,
        step: 'params',
        error: null,
      }));
    }
  }

  /**
   * Generate a workout using the provided parameters and user profile
   */
  async generateWorkout(params: Partial<WorkoutInput>): Promise<void> {
    const profile = this.userProfile.profile();
    if (!profile) {
      throw new Error('User profile required to generate workout');
    }

    const workoutType = this.selectedType();
    if (!workoutType) {
      throw new Error('Workout type not selected');
    }

    // Build the complete workout input with user profile
    const input = {
      ...params,
      workout_type: workoutType,
      user: profile,
    } as WorkoutInput;

    // Update state to generating
    this.formState.update((state) => ({
      ...state,
      step: 'generating',
      params,
      error: null,
    }));

    // Reset save state for new generation
    this.savedWorkoutId.set(null);

    try {
      const result = await firstValueFrom(this.api.generateWorkout(input));

      // Update state with results
      this.formState.update((state) => ({
        ...state,
        step: 'results',
        generatedWorkout: result.workout,
        originalInput: input,
        error: null,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate workout';
      this.formState.update((state) => ({
        ...state,
        step: 'params',
        error: errorMessage,
      }));
      throw err;
    }
  }

  /**
   * Revise the entire workout using natural language instructions
   */
  async reviseWorkout(revisionText: string): Promise<void> {
    const workout = this.generatedWorkout();
    const input = this.originalInput();

    if (!workout || !input) {
      throw new Error('No workout to revise');
    }

    this.isRevising.set(true);
    this.formState.update((state) => ({ ...state, error: null }));

    try {
      const result = await firstValueFrom(
        this.api.reviseWorkout({
          workout,
          original_input: input,
          revision_text: revisionText,
        })
      );

      this.formState.update((state) => ({
        ...state,
        generatedWorkout: result.workout,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revise workout';
      this.formState.update((state) => ({ ...state, error: errorMessage }));
      throw err;
    } finally {
      this.isRevising.set(false);
    }
  }

  /**
   * Revise a specific exercise using natural language instructions
   */
  async reviseExercise(exerciseIndex: number, revisionText: string): Promise<void> {
    const workout = this.generatedWorkout();
    const input = this.originalInput();

    if (!workout || !input) {
      throw new Error('No workout context for exercise revision');
    }

    if (workout.workout_type === 'conditioning') {
      throw new Error('Cannot revise exercises on conditioning workouts');
    }

    const exercises = workout.exercises;
    const exercise = exercises[exerciseIndex];
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    this.isRevising.set(true);
    this.revisingExerciseIndex.set(exerciseIndex);
    this.formState.update((state) => ({ ...state, error: null }));

    try {
      const revisedExercise = await firstValueFrom(
        this.api.reviseExercise({
          exercise,
          workout_context: workout,
          original_input: input,
          revision_text: revisionText,
        })
      );

      // Replace the exercise at the given index
      const updatedExercises = [...exercises];
      updatedExercises[exerciseIndex] = revisedExercise;

      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises,
      } as WorkoutOutput;

      this.formState.update((state) => ({
        ...state,
        generatedWorkout: updatedWorkout,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revise exercise';
      this.formState.update((state) => ({ ...state, error: errorMessage }));
      throw err;
    } finally {
      this.isRevising.set(false);
      this.revisingExerciseIndex.set(null);
    }
  }

  /**
   * Revise a specific interval using natural language instructions
   */
  async reviseInterval(intervalIndex: number, revisionText: string): Promise<void> {
    const workout = this.generatedWorkout();
    const input = this.originalInput();

    if (!workout || !input) {
      throw new Error('No workout context for interval revision');
    }

    if (workout.workout_type !== 'conditioning') {
      throw new Error('Can only revise intervals on conditioning workouts');
    }

    const intervals = (workout as ConditioningOutput).intervals;
    const interval = intervals[intervalIndex];
    if (!interval) {
      throw new Error('Interval not found');
    }

    this.isRevising.set(true);
    this.revisingIntervalIndex.set(intervalIndex);
    this.formState.update((state) => ({ ...state, error: null }));

    try {
      const revisedInterval = await firstValueFrom(
        this.api.reviseInterval({
          interval,
          workout_context: workout,
          original_input: input,
          revision_text: revisionText,
        })
      );

      // Replace the interval at the given index
      const updatedIntervals = [...intervals];
      updatedIntervals[intervalIndex] = revisedInterval;

      const updatedWorkout = {
        ...workout,
        intervals: updatedIntervals,
      } as WorkoutOutput;

      this.formState.update((state) => ({
        ...state,
        generatedWorkout: updatedWorkout,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revise interval';
      this.formState.update((state) => ({ ...state, error: errorMessage }));
      throw err;
    } finally {
      this.isRevising.set(false);
      this.revisingIntervalIndex.set(null);
    }
  }

  /**
   * Save the current workout to Supabase (with offline IndexedDB fallback)
   */
  async saveWorkout(): Promise<void> {
    const workout = this.generatedWorkout();
    const input = this.originalInput();

    if (!workout || !input) {
      throw new Error('No workout to save');
    }

    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      throw new Error('No authenticated user');
    }

    this.isSaving.set(true);
    this.formState.update((state) => ({ ...state, error: null }));

    const workoutId = crypto.randomUUID();
    const now = new Date().toISOString();
    const row: WorkoutRow = {
      id: workoutId,
      user_id: userId,
      workout_type: workout.workout_type,
      data: workout,
      input,
      created_at: now,
      updated_at: now,
    };

    try {
      const { error } = await this.supabase.from('workouts').insert({
        id: row.id,
        user_id: row.user_id,
        workout_type: row.workout_type,
        data: row.data,
        input: row.input,
        created_at: row.created_at,
        updated_at: row.updated_at,
      });

      if (error) {
        throw error;
      }

      // Also cache in IndexedDB
      await this.indexedDb.saveWorkout(row);
      this.savedWorkoutId.set(workoutId);
    } catch (err) {
      // Offline fallback: save to IndexedDB + sync queue
      await this.indexedDb.saveWorkout(row);
      await this.indexedDb.addToSyncQueue({
        id: crypto.randomUUID(),
        type: 'create',
        table: 'workouts',
        data: { ...row, id: row.id },
        timestamp: Date.now(),
        retries: 0,
      });
      this.savedWorkoutId.set(workoutId);
      console.warn('Workout saved offline, will sync when online:', err);
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Update the generated workout (for manual edits)
   */
  updateWorkout(workout: WorkoutOutput): void {
    this.formState.update((state) => ({
      ...state,
      generatedWorkout: workout,
    }));
  }

  /**
   * Reset the workout flow to start over
   */
  reset(): void {
    const resetState: WorkoutFormState = {
      step: 'type-selection',
      selectedType: null,
      params: null,
      generatedWorkout: null,
      originalInput: null,
      error: null,
    };
    this.formState.set(resetState);
    this.savedWorkoutId.set(null);
    // Clear from sessionStorage as well
    try {
      sessionStorage.removeItem(WORKOUT_STATE_KEY);
    } catch (err) {
      console.error('Failed to clear workout state from session:', err);
    }
  }
}
