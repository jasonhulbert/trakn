import { z } from 'zod';
import { GymEquipmentSchema } from '../common/equipment.schema';
import { BaseWorkoutInputSchema } from './base-workout-input.schema';
import { TargetMuscleGroupSchema, WeightProgressionPatternSchema } from './hypertrophy-input.schema';

export const StrengthInputSchema = BaseWorkoutInputSchema.merge(GymEquipmentSchema).extend({
  target_muscle_group: TargetMuscleGroupSchema.describe('Primary muscle group to target'),
  load_percentage: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe('Target load as percentage of estimated max (e.g., 75 for 75%)'),
  weight_progression_pattern: WeightProgressionPatternSchema.describe('Pattern for progressing weight across sets'),
});

export type StrengthInput = z.infer<typeof StrengthInputSchema>;
