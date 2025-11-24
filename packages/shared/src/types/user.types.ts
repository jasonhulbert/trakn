export interface Profile {
  id: string;
  equipment_available: string[];
  training_frequency: number;
  unit_preference: 'imperial' | 'metric';
  created_at: string;
  updated_at: string;
}

export interface CreateProfileInput {
  equipment_available?: string[];
  training_frequency?: number;
  unit_preference?: 'imperial' | 'metric';
}

export interface UpdateProfileInput {
  equipment_available?: string[];
  training_frequency?: number;
  unit_preference?: 'imperial' | 'metric';
}
