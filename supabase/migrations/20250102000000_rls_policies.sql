-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_workouts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Exercises policies
-- Allow users to view all non-custom exercises (global library)
CREATE POLICY "Users can view global exercises"
  ON exercises FOR SELECT
  USING (is_custom = false OR user_id = auth.uid());

CREATE POLICY "Users can create own custom exercises"
  ON exercises FOR INSERT
  WITH CHECK (user_id = auth.uid() AND is_custom = true);

CREATE POLICY "Users can update own custom exercises"
  ON exercises FOR UPDATE
  USING (user_id = auth.uid() AND is_custom = true);

CREATE POLICY "Users can delete own custom exercises"
  ON exercises FOR DELETE
  USING (user_id = auth.uid() AND is_custom = true);

-- Workouts policies
CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workouts"
  ON workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON workouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON workouts FOR DELETE
  USING (auth.uid() = user_id);

-- Workout exercises policies
CREATE POLICY "Users can view own workout exercises"
  ON workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workout exercises for own workouts"
  ON workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workout exercises for own workouts"
  ON workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete workout exercises from own workouts"
  ON workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- Workout sessions policies
CREATE POLICY "Users can view own workout sessions"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workout sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout sessions"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout sessions"
  ON workout_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Session sets policies
CREATE POLICY "Users can view own session sets"
  ON session_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_sets.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create session sets for own sessions"
  ON session_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_sets.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update session sets for own sessions"
  ON session_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_sets.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete session sets from own sessions"
  ON session_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = session_sets.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Training plans policies
CREATE POLICY "Users can view own training plans"
  ON training_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own training plans"
  ON training_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training plans"
  ON training_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training plans"
  ON training_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Plan workouts policies
CREATE POLICY "Users can view own plan workouts"
  ON plan_workouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE training_plans.id = plan_workouts.plan_id
      AND training_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create plan workouts for own plans"
  ON plan_workouts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE training_plans.id = plan_workouts.plan_id
      AND training_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update plan workouts for own plans"
  ON plan_workouts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE training_plans.id = plan_workouts.plan_id
      AND training_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete plan workouts from own plans"
  ON plan_workouts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE training_plans.id = plan_workouts.plan_id
      AND training_plans.user_id = auth.uid()
    )
  );
