export interface Workout {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  source: 'custom' | 'ai_generated';
  ai_prompt: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  position: number;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  notes: string | null;
  created_at: string;
}

export interface WorkoutWithExercises extends Workout {
  exercises: WorkoutExerciseDetail[];
}

export interface WorkoutExerciseDetail extends WorkoutExercise {
  exercise_name: string;
  muscle_groups: string[];
  equipment_required: string[];
}

export interface CreateWorkoutInput {
  name: string;
  description?: string;
  source?: 'custom' | 'ai_generated';
  ai_prompt?: string;
}

export interface UpdateWorkoutInput {
  name?: string;
  description?: string;
}

export interface CreateWorkoutExerciseInput {
  workout_id: string;
  exercise_id: string;
  position: number;
  target_sets: number;
  target_reps: string;
  rest_seconds?: number;
  notes?: string;
}

export interface UpdateWorkoutExerciseInput {
  position?: number;
  target_sets?: number;
  target_reps?: string;
  rest_seconds?: number;
  notes?: string;
}
