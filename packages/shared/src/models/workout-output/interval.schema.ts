import { z } from 'zod';
import { CardioModalitySchema } from '../workout-input/conditioning-input.schema.js';

export const IntensityLevelSchema = z.enum(['low', 'moderate', 'high', 'max']);

export const IntervalSchema = z.object({
  interval_number: z.number().int().positive().describe('Sequential interval number'),
  work_duration_seconds: z.number().int().positive().describe('Duration of work period in seconds'),
  rest_duration_seconds: z.number().int().nonnegative().describe('Duration of rest/recovery period in seconds'),
  intensity: IntensityLevelSchema.describe('Intensity level for this interval'),
  modality: CardioModalitySchema.describe('Cardio modality for this interval'),
  notes: z.string().optional().describe('Pacing guidance or intensity targets'),
});

export type IntensityLevel = z.infer<typeof IntensityLevelSchema>;
export type Interval = z.infer<typeof IntervalSchema>;
