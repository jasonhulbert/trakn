import { z } from 'zod';
import { WeightUnitSchema } from './weight-unit.schema.js';
import { HeightUnitSchema } from './height-unit.schema.js';

export const UserProfileSchema = z.object({
  age: z.number().int().positive().describe('User age in years'),
  weight: z.number().positive().describe('User weight'),
  weight_unit: WeightUnitSchema.describe('Unit for user weight'),
  height: z.number().positive().optional().describe('User height'),
  height_unit: HeightUnitSchema.optional().describe('Unit for user height'),
  fitness_level: z.number().int().min(1).max(5).describe('User fitness level on a 1-5 scale'),
  physical_limitations: z.string().optional().describe('Description of any physical limitations or injuries'),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
