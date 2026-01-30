import { z } from 'zod';
import { CardioModalitySchema } from '../workout-input/conditioning-input.schema.js';
import { IntervalSchema } from './interval.schema.js';

export const ConditioningOutputSchema = z.object({
  workout_type: z.literal('conditioning'),
  cardio_modality: CardioModalitySchema.describe('The primary cardio modality used'),
  total_duration_minutes: z.number().int().positive().describe('Total workout duration in minutes'),
  difficulty_rating: z.number().int().min(1).max(5).describe('Difficulty rating on a 1-5 scale'),
  warmup: z.array(z.string()).describe('Warm-up activities or instructions'),
  intervals: z.array(IntervalSchema).min(1).describe('Workout intervals with timing and intensity'),
  cooldown: z.array(z.string()).describe('Cool-down activities or instructions'),
  general_notes: z.string().describe('Overall pacing strategy and progression advice'),
  estimated_calories: z.number().int().positive().optional().describe('Rough estimate of calories burned'),
  conflicting_parameters: z.string().nullable().describe('Explanation of parameter conflicts if any exist'),
});

export type ConditioningOutput = z.infer<typeof ConditioningOutputSchema>;
