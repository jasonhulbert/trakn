import { z } from 'zod';
import { HypertrophyInputSchema } from './hypertrophy-input.schema.js';
import { StrengthInputSchema } from './strength-input.schema.js';
import { ConditioningInputSchema } from './conditioning-input.schema.js';

export const WorkoutTypeSchema = z.enum(['hypertrophy', 'strength', 'conditioning']);

export const WorkoutInputSchema = z.discriminatedUnion('workout_type', [
  HypertrophyInputSchema.extend({
    workout_type: z.literal('hypertrophy'),
  }),
  StrengthInputSchema.extend({
    workout_type: z.literal('strength'),
  }),
  ConditioningInputSchema.extend({
    workout_type: z.literal('conditioning'),
  }),
]);

export type WorkoutType = z.infer<typeof WorkoutTypeSchema>;
export type WorkoutInput = z.infer<typeof WorkoutInputSchema>;
