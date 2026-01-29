import { z } from 'zod';
import { ConditioningEquipmentSchema } from '../common/equipment.schema';
import { BaseWorkoutInputSchema } from './base-workout-input.schema';

export const IntervalStructureSchema = z.enum(['hiit', 'steady_state', 'mixed', 'tabata', 'emom']);

export const CardioModalitySchema = z.enum([
  'running',
  'cycling',
  'rowing',
  'swimming',
  'jump_rope',
  'assault_bike',
  'elliptical',
  'stair_climber',
  'mixed',
]);

export const ConditioningInputSchema = BaseWorkoutInputSchema.merge(ConditioningEquipmentSchema).extend({
  interval_structure: IntervalStructureSchema.describe('Type of interval structure for the workout'),
  cardio_modality: CardioModalitySchema.describe('Primary cardio modality to use'),
  distance_time_goal: z.string().optional().describe('Optional distance or time goal (e.g., "5k", "30 minutes")'),
});

export type IntervalStructure = z.infer<typeof IntervalStructureSchema>;
export type CardioModality = z.infer<typeof CardioModalitySchema>;
export type ConditioningInput = z.infer<typeof ConditioningInputSchema>;
