import { z } from 'zod';
import { HypertrophyOutputSchema } from './hypertrophy-output.schema';
import { StrengthOutputSchema } from './strength-output.schema';
import { ConditioningOutputSchema } from './conditioning-output.schema';

export const WorkoutOutputSchema = z.discriminatedUnion('workout_type', [
  HypertrophyOutputSchema,
  StrengthOutputSchema,
  ConditioningOutputSchema,
]);

export type WorkoutOutput = z.infer<typeof WorkoutOutputSchema>;
