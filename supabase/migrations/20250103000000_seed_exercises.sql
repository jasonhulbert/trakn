-- Seed global exercise library with common exercises
-- Note: is_custom = false and user_id = NULL for global exercises

-- Chest exercises
INSERT INTO exercises (name, muscle_groups, equipment_required, description, is_custom) VALUES
  ('Barbell Bench Press', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'Classic horizontal pressing movement for chest development', false),
  ('Incline Barbell Bench Press', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'Upper chest focus with incline angle', false),
  ('Dumbbell Bench Press', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbells', 'bench'], 'Greater range of motion than barbell variation', false),
  ('Incline Dumbbell Press', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbells', 'bench'], 'Upper chest emphasis with dumbbells', false),
  ('Dumbbell Flyes', ARRAY['chest'], ARRAY['dumbbells', 'bench'], 'Isolation exercise for chest stretch and contraction', false),
  ('Push-ups', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['bodyweight'], 'Bodyweight pressing movement', false),
  ('Cable Chest Flyes', ARRAY['chest'], ARRAY['cable'], 'Constant tension chest isolation', false);

-- Back exercises
INSERT INTO exercises (name, muscle_groups, equipment_required, description, is_custom) VALUES
  ('Barbell Row', ARRAY['back', 'biceps'], ARRAY['barbell'], 'Fundamental horizontal pulling movement', false),
  ('Deadlift', ARRAY['back', 'glutes', 'hamstrings'], ARRAY['barbell'], 'Total body posterior chain exercise', false),
  ('Pull-ups', ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'Vertical pulling bodyweight exercise', false),
  ('Lat Pulldown', ARRAY['back', 'biceps'], ARRAY['cable'], 'Vertical pulling machine alternative to pull-ups', false),
  ('Seated Cable Row', ARRAY['back', 'biceps'], ARRAY['cable'], 'Horizontal pulling with constant tension', false),
  ('T-Bar Row', ARRAY['back', 'biceps'], ARRAY['barbell'], 'Supported horizontal row variation', false),
  ('Dumbbell Row', ARRAY['back', 'biceps'], ARRAY['dumbbells'], 'Single-arm rowing movement', false),
  ('Face Pulls', ARRAY['back', 'shoulders'], ARRAY['cable'], 'Upper back and rear delt exercise', false);

-- Shoulder exercises
INSERT INTO exercises (name, muscle_groups, equipment_required, description, is_custom) VALUES
  ('Overhead Press', ARRAY['shoulders', 'triceps'], ARRAY['barbell'], 'Standing or seated vertical press', false),
  ('Dumbbell Shoulder Press', ARRAY['shoulders', 'triceps'], ARRAY['dumbbells'], 'Seated or standing overhead press with dumbbells', false),
  ('Lateral Raises', ARRAY['shoulders'], ARRAY['dumbbells'], 'Medial deltoid isolation', false),
  ('Front Raises', ARRAY['shoulders'], ARRAY['dumbbells'], 'Anterior deltoid isolation', false),
  ('Rear Delt Flyes', ARRAY['shoulders'], ARRAY['dumbbells'], 'Posterior deltoid isolation', false),
  ('Arnold Press', ARRAY['shoulders', 'triceps'], ARRAY['dumbbells'], 'Rotational shoulder press variation', false);

-- Leg exercises
INSERT INTO exercises (name, muscle_groups, equipment_required, description, is_custom) VALUES
  ('Barbell Back Squat', ARRAY['quads', 'glutes', 'hamstrings'], ARRAY['barbell', 'squat rack'], 'Fundamental lower body compound movement', false),
  ('Front Squat', ARRAY['quads', 'glutes'], ARRAY['barbell', 'squat rack'], 'Quad-focused squat variation', false),
  ('Romanian Deadlift', ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], 'Hip hinge movement for posterior chain', false),
  ('Bulgarian Split Squat', ARRAY['quads', 'glutes'], ARRAY['dumbbells'], 'Single-leg squat variation', false),
  ('Leg Press', ARRAY['quads', 'glutes'], ARRAY['machine'], 'Machine-based leg compound', false),
  ('Leg Curl', ARRAY['hamstrings'], ARRAY['machine'], 'Hamstring isolation exercise', false),
  ('Leg Extension', ARRAY['quads'], ARRAY['machine'], 'Quad isolation exercise', false),
  ('Walking Lunges', ARRAY['quads', 'glutes'], ARRAY['dumbbells'], 'Dynamic single-leg movement', false),
  ('Calf Raises', ARRAY['calves'], ARRAY['dumbbells', 'machine'], 'Calf isolation exercise', false);

-- Arm exercises
INSERT INTO exercises (name, muscle_groups, equipment_required, description, is_custom) VALUES
  ('Barbell Curl', ARRAY['biceps'], ARRAY['barbell'], 'Classic bicep mass builder', false),
  ('Dumbbell Curl', ARRAY['biceps'], ARRAY['dumbbells'], 'Alternating or simultaneous bicep curls', false),
  ('Hammer Curl', ARRAY['biceps', 'forearms'], ARRAY['dumbbells'], 'Neutral grip curl for brachialis', false),
  ('Preacher Curl', ARRAY['biceps'], ARRAY['barbell', 'bench'], 'Supported curl for bicep isolation', false),
  ('Cable Curl', ARRAY['biceps'], ARRAY['cable'], 'Constant tension bicep exercise', false),
  ('Tricep Dips', ARRAY['triceps', 'chest'], ARRAY['dip bars'], 'Bodyweight tricep exercise', false),
  ('Close-Grip Bench Press', ARRAY['triceps', 'chest'], ARRAY['barbell', 'bench'], 'Compound tricep movement', false),
  ('Tricep Pushdown', ARRAY['triceps'], ARRAY['cable'], 'Cable tricep isolation', false),
  ('Overhead Tricep Extension', ARRAY['triceps'], ARRAY['dumbbells'], 'Overhead tricep stretch exercise', false),
  ('Skull Crushers', ARRAY['triceps'], ARRAY['barbell'], 'Lying tricep extension', false);

-- Core exercises
INSERT INTO exercises (name, muscle_groups, equipment_required, description, is_custom) VALUES
  ('Plank', ARRAY['core'], ARRAY['bodyweight'], 'Isometric core stability exercise', false),
  ('Russian Twists', ARRAY['core'], ARRAY['bodyweight'], 'Rotational core movement', false),
  ('Hanging Leg Raises', ARRAY['core'], ARRAY['pull-up bar'], 'Advanced lower ab exercise', false),
  ('Ab Wheel Rollout', ARRAY['core'], ARRAY['ab wheel'], 'Dynamic core stability exercise', false),
  ('Cable Crunch', ARRAY['core'], ARRAY['cable'], 'Weighted abdominal crunch', false),
  ('Dead Bug', ARRAY['core'], ARRAY['bodyweight'], 'Core stability and coordination exercise', false);

-- Full body / Olympic lifts
INSERT INTO exercises (name, muscle_groups, equipment_required, description, is_custom) VALUES
  ('Power Clean', ARRAY['back', 'shoulders', 'legs'], ARRAY['barbell'], 'Explosive Olympic lift variation', false),
  ('Thruster', ARRAY['shoulders', 'legs'], ARRAY['barbell'], 'Front squat to overhead press', false),
  ('Kettlebell Swing', ARRAY['glutes', 'hamstrings', 'back'], ARRAY['kettlebell'], 'Explosive hip hinge movement', false);
