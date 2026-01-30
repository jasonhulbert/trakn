import { z } from 'zod';
import { HypertrophyOutputSchema } from './hypertrophy-output.schema.js';
import { StrengthOutputSchema } from './strength-output.schema.js';
import { ConditioningOutputSchema } from './conditioning-output.schema.js';

export const WorkoutOutputSchema = z.discriminatedUnion('workout_type', [
  HypertrophyOutputSchema,
  StrengthOutputSchema,
  ConditioningOutputSchema,
]);

export type WorkoutOutput = z.infer<typeof WorkoutOutputSchema>;
