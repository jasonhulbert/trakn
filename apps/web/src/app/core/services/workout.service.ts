import { Injectable, inject, signal, computed, effect } from '@angular/core';
import type { WorkoutInput, WorkoutOutput, Exercise } from '@trkn-shared';
import { ApiService } from './api.service';
import { UserProfileService } from './user-profile.service';
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
   * (Will be implemented in Phase 5)
   */
  async reviseWorkout(_revisionText: string): Promise<void> {
    const workout = this.generatedWorkout();
    const input = this.originalInput();

    if (!workout || !input) {
      throw new Error('No workout to revise');
    }

    // TODO: Implement in Phase 5
    throw new Error('Workout revision not yet implemented');
  }

  /**
   * Revise a specific exercise using natural language instructions
   * (Will be implemented in Phase 5)
   */
  async reviseExercise(_exercise: Exercise, _revisionText: string): Promise<Exercise> {
    const workout = this.generatedWorkout();
    const input = this.originalInput();

    if (!workout || !input) {
      throw new Error('No workout context for exercise revision');
    }

    // TODO: Implement in Phase 5
    throw new Error('Exercise revision not yet implemented');
  }

  /**
   * Save the current workout to Supabase
   * (Will be implemented in Phase 5)
   */
  async saveWorkout(): Promise<void> {
    const workout = this.generatedWorkout();
    const input = this.originalInput();

    if (!workout || !input) {
      throw new Error('No workout to save');
    }

    // TODO: Implement in Phase 5
    throw new Error('Workout saving not yet implemented');
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
    // Clear from sessionStorage as well
    try {
      sessionStorage.removeItem(WORKOUT_STATE_KEY);
    } catch (err) {
      console.error('Failed to clear workout state from session:', err);
    }
  }

  /**
   * Update the generated workout (for manual edits in Phase 5)
   */
  updateWorkout(workout: WorkoutOutput): void {
    this.formState.update((state) => ({
      ...state,
      generatedWorkout: workout,
    }));
  }
}
