import type { WorkoutOutput } from '../models';

/**
 * Result from the workout generation chain.
 */
export interface WorkoutGeneratorResult {
  workout: WorkoutOutput;
  generatedAt: string;
}

/**
 * Standard API error response structure.
 */
export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

/**
 * Standard API success response wrapper.
 */
export interface ApiSuccessResponse<T> {
  data: T;
  timestamp?: string;
}
