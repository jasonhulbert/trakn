import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import type {
  Workout,
  WorkoutExercise,
  WorkoutSession,
  SessionSet,
  Exercise,
  TrainingPlan,
  PlanWorkout,
  SyncOperation,
} from '@trakn/shared';

export class TraknDatabase extends Dexie {
  // Tables
  exercises!: Table<Exercise, string>;
  workouts!: Table<Workout, string>;
  workoutExercises!: Table<WorkoutExercise, string>;
  workoutSessions!: Table<WorkoutSession, string>;
  sessionSets!: Table<SessionSet, string>;
  trainingPlans!: Table<TrainingPlan, string>;
  planWorkouts!: Table<PlanWorkout, string>;
  syncQueue!: Table<SyncOperation, string>;

  constructor() {
    super('TraknDB');

    this.version(1).stores({
      exercises: 'id, name, user_id, is_custom',
      workouts: 'id, user_id, created_at, source',
      workoutExercises: 'id, workout_id, exercise_id, position',
      workoutSessions: 'id, user_id, workout_id, started_at, completed_at, synced, [user_id+synced]',
      sessionSets: 'id, session_id, exercise_id',
      trainingPlans: 'id, user_id, created_at',
      planWorkouts: 'id, plan_id, workout_id, [plan_id+week_number+day_number]',
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

  // Exercise operations
  async getExercises(): Promise<Exercise[]> {
    return this.db.exercises.toArray();
  }

  async getExerciseById(id: string): Promise<Exercise | undefined> {
    return this.db.exercises.get(id);
  }

  async saveExercise(exercise: Exercise): Promise<string> {
    return this.db.exercises.put(exercise);
  }

  async deleteExercise(id: string): Promise<void> {
    await this.db.exercises.delete(id);
  }

  // Workout operations
  async getWorkouts(userId: string): Promise<Workout[]> {
    return this.db.workouts.where('user_id').equals(userId).toArray();
  }

  async getWorkoutById(id: string): Promise<Workout | undefined> {
    return this.db.workouts.get(id);
  }

  async saveWorkout(workout: Workout): Promise<string> {
    return this.db.workouts.put(workout);
  }

  async deleteWorkout(id: string): Promise<void> {
    await this.db.workouts.delete(id);
  }

  // Workout exercise operations
  async getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    return this.db.workoutExercises.where('workout_id').equals(workoutId).sortBy('position');
  }

  async saveWorkoutExercise(exercise: WorkoutExercise): Promise<string> {
    return this.db.workoutExercises.put(exercise);
  }

  async deleteWorkoutExercise(id: string): Promise<void> {
    await this.db.workoutExercises.delete(id);
  }

  // Session operations
  async getWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
    return this.db.workoutSessions.where('user_id').equals(userId).reverse().sortBy('started_at');
  }

  async getSessionById(id: string): Promise<WorkoutSession | undefined> {
    return this.db.workoutSessions.get(id);
  }

  async saveWorkoutSession(session: WorkoutSession): Promise<string> {
    return this.db.workoutSessions.put(session);
  }

  async deleteWorkoutSession(id: string): Promise<void> {
    await this.db.workoutSessions.delete(id);
  }

  async getUnsyncedSessions(userId: string): Promise<WorkoutSession[]> {
    return this.db.workoutSessions
      .where('user_id')
      .equals(userId)
      .filter((session) => session.synced === false)
      .toArray();
  }

  // Session set operations
  async getSessionSets(sessionId: string): Promise<SessionSet[]> {
    return this.db.sessionSets.where('session_id').equals(sessionId).sortBy('set_number');
  }

  async saveSessionSet(set: SessionSet): Promise<string> {
    return this.db.sessionSets.put(set);
  }

  async deleteSessionSet(id: string): Promise<void> {
    await this.db.sessionSets.delete(id);
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

  // Training plan operations
  async getTrainingPlans(userId: string): Promise<TrainingPlan[]> {
    return this.db.trainingPlans.where('user_id').equals(userId).toArray();
  }

  async getTrainingPlanById(id: string): Promise<TrainingPlan | undefined> {
    return this.db.trainingPlans.get(id);
  }

  async saveTrainingPlan(plan: TrainingPlan): Promise<string> {
    return this.db.trainingPlans.put(plan);
  }

  async deleteTrainingPlan(id: string): Promise<void> {
    await this.db.trainingPlans.delete(id);
  }

  // Plan workout operations
  async getPlanWorkouts(planId: string): Promise<PlanWorkout[]> {
    return this.db.planWorkouts.where('plan_id').equals(planId).toArray();
  }

  async savePlanWorkout(planWorkout: PlanWorkout): Promise<string> {
    return this.db.planWorkouts.put(planWorkout);
  }

  async deletePlanWorkout(id: string): Promise<void> {
    await this.db.planWorkouts.delete(id);
  }

  // Clear all data (useful for logout)
  async clearAllData(): Promise<void> {
    await this.db.delete();
    this.db = new TraknDatabase();
  }
}
