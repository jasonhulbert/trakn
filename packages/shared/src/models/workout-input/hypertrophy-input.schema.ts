import { z } from 'zod';
import { GymEquipmentSchema } from '../common/equipment.schema';
import { BaseWorkoutInputSchema } from './base-workout-input.schema';

export const WeightProgressionPatternSchema = z.enum(['pyramid', 'reverse_pyramid', 'straight_sets', 'wave_loading']);

export const TargetMuscleGroupSchema = z.enum([
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'core',
  'full_body',
  'upper_body',
  'lower_body',
  'push',
  'pull',
]);

export const HypertrophyInputSchema = BaseWorkoutInputSchema.merge(GymEquipmentSchema).extend({
  target_muscle_group: TargetMuscleGroupSchema.describe('Primary muscle group to target'),
  tempo_focus: z.boolean().describe('Whether to emphasize controlled tempo in exercises'),
  weight_progression_pattern: WeightProgressionPatternSchema.describe('Pattern for progressing weight across sets'),
});

export type WeightProgressionPattern = z.infer<typeof WeightProgressionPatternSchema>;
export type TargetMuscleGroup = z.infer<typeof TargetMuscleGroupSchema>;
export type HypertrophyInput = z.infer<typeof HypertrophyInputSchema>;
