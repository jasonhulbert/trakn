import { z } from 'zod';
import { UserProfileSchema } from '../common/user-profile.schema';

export const BaseWorkoutInputSchema = UserProfileSchema.extend({
  workout_duration: z.number().int().positive().describe('Desired workout duration in minutes'),
});

export type BaseWorkoutInput = z.infer<typeof BaseWorkoutInputSchema>;
