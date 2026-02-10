import { z } from 'zod';
import { ExerciseSchema } from '../workout-output/exercise.schema.js';
import { WorkoutOutputSchema } from '../workout-output/workout-output.schema.js';
import { WorkoutInputSchema } from '../workout-input/workout-input.schema.js';

export const ExerciseRevisionInputSchema = z.object({
  exercise: ExerciseSchema.describe('The current exercise to revise'),
  workout_context: WorkoutOutputSchema.describe('The full workout for context'),
  original_input: WorkoutInputSchema.describe('The original input used to generate the workout'),
  revision_text: z.string().min(1).max(500).describe('Natural language revision instruction'),
});

export type ExerciseRevisionInput = z.infer<typeof ExerciseRevisionInputSchema>;
