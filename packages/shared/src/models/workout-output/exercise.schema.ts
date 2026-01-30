import { z } from 'zod';
import { WeightUnitSchema } from '../common/weight-unit.schema.js';

export const ExerciseSetSchema = z.object({
  reps: z.number().int().positive().describe('Number of repetitions'),
  rest_duration_seconds: z.number().int().nonnegative().describe('Rest duration in seconds after this set'),
  suggested_weight: z.number().nonnegative().optional().describe('Suggested weight for this set'),
  weight_unit: WeightUnitSchema.optional().describe('Unit for the suggested weight'),
});

export const ExerciseSchema = z.object({
  exercise_name: z.string().describe('Name of the exercise'),
  sets: z.array(ExerciseSetSchema).min(1).describe('Sets for this exercise'),
  notes: z.string().optional().describe('Form cues, tempo guidance, or focus tips'),
});

export type ExerciseSet = z.infer<typeof ExerciseSetSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
