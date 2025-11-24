export interface Exercise {
  id: string;
  name: string;
  muscle_groups: string[];
  equipment_required: string[];
  description: string | null;
  is_custom: boolean;
  user_id: string | null;
  created_at: string;
}

export interface CreateExerciseInput {
  name: string;
  muscle_groups: string[];
  equipment_required: string[];
  description?: string;
  is_custom?: boolean;
}

export interface UpdateExerciseInput {
  name?: string;
  muscle_groups?: string[];
  equipment_required?: string[];
  description?: string;
}
