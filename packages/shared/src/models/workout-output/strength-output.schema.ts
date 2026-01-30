import { z } from 'zod';
import { TargetMuscleGroupSchema } from '../workout-input/hypertrophy-input.schema.js';
import { WeightProgressionPatternSchema } from '../workout-input/hypertrophy-input.schema.js';
import { ExerciseSchema } from './exercise.schema.js';

export const StrengthOutputSchema = z.object({
  workout_type: z.literal('strength'),
  target_muscle_group: TargetMuscleGroupSchema.describe('The targeted muscle group'),
  total_duration_minutes: z.number().int().positive().describe('Total workout duration in minutes'),
  difficulty_rating: z.number().int().min(1).max(5).describe('Difficulty rating on a 1-5 scale'),
  warmup: z.array(z.string()).describe('Warm-up exercises or instructions'),
  exercises: z.array(ExerciseSchema).min(1).describe('Main workout exercises with sets'),
  cooldown: z.array(z.string()).describe('Cool-down exercises or instructions'),
  general_notes: z.string().describe('Overall workout tips, progression advice, or safety reminders'),
  weight_progression_pattern: WeightProgressionPatternSchema.describe('The weight progression pattern used'),
  estimated_intensity: z
    .string()
    .optional()
    .describe('Description of workout intensity (e.g., "Heavy loads around 80-90%")'),
  conflicting_parameters: z.string().nullable().describe('Explanation of parameter conflicts if any exist'),
});

export type StrengthOutput = z.infer<typeof StrengthOutputSchema>;
