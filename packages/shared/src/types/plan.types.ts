export interface TrainingPlan {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  weeks: number;
  created_at: string;
  updated_at: string;
}

export interface PlanWorkout {
  id: string;
  plan_id: string;
  workout_id: string;
  week_number: number;
  day_number: number;
  notes: string | null;
  created_at: string;
}

export interface PlanWithWorkouts extends TrainingPlan {
  workouts: PlanWorkoutDetail[];
}

export interface PlanWorkoutDetail extends PlanWorkout {
  workout_name: string;
  workout_description: string | null;
}

export interface CreatePlanInput {
  name: string;
  description?: string;
  weeks?: number;
}

export interface UpdatePlanInput {
  name?: string;
  description?: string;
  weeks?: number;
}

export interface CreatePlanWorkoutInput {
  plan_id: string;
  workout_id: string;
  week_number: number;
  day_number: number;
  notes?: string;
}

export interface UpdatePlanWorkoutInput {
  week_number?: number;
  day_number?: number;
  notes?: string;
}
