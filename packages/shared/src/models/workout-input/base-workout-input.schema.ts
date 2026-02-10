import { z } from 'zod';
import { UserProfileSchema } from '../common/user-profile.schema.js';

export const BaseWorkoutInputSchema = z.object({
  user: UserProfileSchema.describe('User profile information'),
  workout_duration: z.number().int().positive().describe('Desired workout duration in minutes'),
});

export type BaseWorkoutInput = z.infer<typeof BaseWorkoutInputSchema>;
