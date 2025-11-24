-- Additional performance indexes beyond those in initial schema

-- Composite indexes for common query patterns

-- Workouts: User + date filtering
CREATE INDEX idx_workouts_user_created ON workouts(user_id, created_at DESC);

-- Workout sessions: User + completion status
CREATE INDEX idx_sessions_user_completed ON workout_sessions(user_id, completed_at DESC NULLS LAST);

-- Session sets: Session + exercise for workout history queries
CREATE INDEX idx_session_sets_session_exercise ON session_sets(session_id, exercise_id);

-- Exercise performance tracking: User's sets by exercise over time
CREATE INDEX idx_session_sets_user_exercise_time ON session_sets(exercise_id, created_at DESC)
  WHERE completed = true;

-- Plan workouts: Plan + week + day for calendar views
CREATE INDEX idx_plan_workouts_calendar ON plan_workouts(plan_id, week_number, day_number);

-- Partial indexes for specific queries

-- Only show completed workout sessions in history
CREATE INDEX idx_completed_sessions ON workout_sessions(user_id, completed_at DESC)
  WHERE completed_at IS NOT NULL;

-- Only show unsynced sessions for offline sync
CREATE INDEX idx_unsynced_sessions ON workout_sessions(user_id, started_at)
  WHERE synced = false;

-- Full-text search preparation (for future exercise search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_exercises_name_trgm ON exercises USING gin(name gin_trgm_ops);
