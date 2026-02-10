import { z } from 'zod';
import { WeightUnitSchema } from './weight-unit.schema.js';

export const UserProfileSchema = z.object({
  age: z.number().int().positive().describe('User age in years'),
  weight: z.number().positive().describe('User weight'),
  weight_unit: WeightUnitSchema.describe('Unit for user weight'),
  fitness_level: z.number().int().min(1).max(5).describe('User fitness level on a 1-5 scale'),
  physical_limitations: z.string().describe('Description of any physical limitations or injuries'),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
