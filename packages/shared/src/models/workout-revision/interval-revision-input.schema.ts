import { z } from 'zod';
import { IntervalSchema } from '../workout-output/interval.schema.js';
import { WorkoutOutputSchema } from '../workout-output/workout-output.schema.js';
import { WorkoutInputSchema } from '../workout-input/workout-input.schema.js';

export const IntervalRevisionInputSchema = z.object({
  interval: IntervalSchema.describe('The current interval to revise'),
  workout_context: WorkoutOutputSchema.describe('The full workout for context'),
  original_input: WorkoutInputSchema.describe('The original input used to generate the workout'),
  revision_text: z.string().min(1).max(500).describe('Natural language revision instruction'),
});

export type IntervalRevisionInput = z.infer<typeof IntervalRevisionInputSchema>;
