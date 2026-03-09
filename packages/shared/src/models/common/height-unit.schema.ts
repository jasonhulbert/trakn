import { z } from 'zod';

export const HeightUnitSchema = z.enum(['in', 'cm']);

export type HeightUnit = z.infer<typeof HeightUnitSchema>;
