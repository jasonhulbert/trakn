import { z } from 'zod';
import { WorkoutOutputSchema } from '../workout-output/workout-output.schema.js';
import { WorkoutInputSchema } from '../workout-input/workout-input.schema.js';

export const WorkoutRevisionInputSchema = z.object({
  workout: WorkoutOutputSchema.describe('The current workout to revise'),
  original_input: WorkoutInputSchema.describe('The original input used to generate the workout'),
  revision_text: z.string().min(1).max(500).describe('Natural language revision instruction'),
});

export type WorkoutRevisionInput = z.infer<typeof WorkoutRevisionInputSchema>;
