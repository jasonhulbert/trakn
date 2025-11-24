export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id: string | null;
  started_at: string;
  completed_at: string | null;
  notes: string | null;
  synced: boolean;
  created_at: string;
}

export interface SessionSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface SessionWithSets extends WorkoutSession {
  sets: SessionSetDetail[];
  workout_name?: string;
}

export interface SessionSetDetail extends SessionSet {
  exercise_name: string;
  muscle_groups: string[];
}

export interface CreateSessionInput {
  workout_id?: string;
  notes?: string;
}

export interface UpdateSessionInput {
  completed_at?: string;
  notes?: string;
  synced?: boolean;
}

export interface CreateSessionSetInput {
  session_id: string;
  exercise_id: string;
  set_number: number;
  reps?: number;
  weight?: number;
  completed?: boolean;
  notes?: string;
}

export interface UpdateSessionSetInput {
  reps?: number;
  weight?: number;
  completed?: boolean;
  notes?: string;
}

// Offline sync types
export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retries: number;
}

export interface SyncStatus {
  pending: number;
  synced: number;
  failed: number;
  lastSyncAt: string | null;
}
