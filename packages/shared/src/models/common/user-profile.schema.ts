import { z } from 'zod';
import { WeightUnitSchema } from './weight-unit.schema';

export const UserProfileSchema = z.object({
  user_age: z.number().int().positive().describe('User age in years'),
  user_weight: z.number().positive().describe('User weight'),
  user_weight_unit: WeightUnitSchema.describe('Unit for user weight'),
  user_fitness_level: z.number().int().min(1).max(5).describe('User fitness level on a 1-5 scale'),
  user_physical_limitations: z.string().describe('Description of any physical limitations or injuries'),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
