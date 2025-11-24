// AI workout generation types

export interface GenerateWorkoutRequest {
  prompt: string;
  userId: string;
}

export interface GenerateWorkoutResponse {
  name: string;
  description: string;
  exercises: AIGeneratedExercise[];
}

export interface AIGeneratedExercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

export interface UserContext {
  recentWorkouts: WorkoutSummary[];
  frequency: number;
  equipment: string[];
  recentMuscleGroups: string[];
  lastWorkoutDate: string | null;
}

export interface WorkoutSummary {
  name: string;
  date: string;
  exercises: string[];
  muscleGroups: string[];
}

// Training plan generation
export interface GeneratePlanRequest {
  prompt: string;
  userId: string;
  weeks?: number;
}

export interface GeneratePlanResponse {
  name: string;
  description: string;
  weeks: number;
  schedule: PlanDay[];
}

export interface PlanDay {
  week: number;
  day: number;
  workout: {
    name: string;
    description: string;
    exercises: AIGeneratedExercise[];
  };
}
