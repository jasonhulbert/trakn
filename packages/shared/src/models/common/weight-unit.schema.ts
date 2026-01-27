import { z } from 'zod';

export const WeightUnitSchema = z.enum(['lbs', 'kg']);

export type WeightUnit = z.infer<typeof WeightUnitSchema>;
