import { z } from 'zod';
import { TargetMuscleGroupSchema } from '../workout-input/hypertrophy-input.schema.js';
import { WeightProgressionPatternSchema } from '../workout-input/hypertrophy-input.schema.js';
import { ExerciseSchema } from './exercise.schema.js';

export const HypertrophyOutputSchema = z.object({
  workout_type: z.literal('hypertrophy'),
  target_muscle_group: TargetMuscleGroupSchema.describe('The targeted muscle group'),
  total_duration_minutes: z.number().int().positive().describe('Total workout duration in minutes'),
  difficulty_rating: z.number().int().min(1).max(5).describe('Difficulty rating on a 1-5 scale'),
  warmup: z.array(z.string()).describe('Warm-up exercises or instructions'),
  exercises: z.array(ExerciseSchema).min(1).describe('Main workout exercises with sets'),
  cooldown: z.array(z.string()).describe('Cool-down exercises or instructions'),
  general_notes: z.string().describe('Overall workout tips and progression strategies'),
  weight_progression_pattern: WeightProgressionPatternSchema.describe('The weight progression pattern used'),
  estimated_volume: z.string().optional().describe('Description of total volume (e.g., "24 total sets")'),
  conflicting_parameters: z.string().nullable().describe('Explanation of parameter conflicts if any exist'),
});

export type HypertrophyOutput = z.infer<typeof HypertrophyOutputSchema>;
