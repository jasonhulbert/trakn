import { z } from 'zod';
import { invokeWithRetry } from '../_lib/output-parser-retry.js';
import {
  loadSystemPrompt,
  loadUserPrompt,
  interpolatePrompt,
  validatePromptVariables,
  type PromptConfig,
} from '../_lib/prompt-loader.js';
import {
  WorkoutInputSchema,
  HypertrophyOutputSchema,
  StrengthOutputSchema,
  ConditioningOutputSchema,
  type WorkoutInput,
  type WorkoutOutput,
  type WorkoutType,
  WorkoutGeneratorResult,
  WorkoutTypeSchema,
} from 'trkn-shared';

// Cache loaded prompts to avoid repeated file reads
const systemPromptCache = new Map<string, string>();
const workoutPromptCache = new Map<string, PromptConfig>();

/**
 * Get the system prompt content (cached).
 */
function getSystemPrompt(name: string): string {
  if (!systemPromptCache.has(name)) {
    systemPromptCache.set(name, loadSystemPrompt(name));
  }
  return systemPromptCache.get(name)!;
}

/**
 * Get the workout prompt config for a specific type (cached).
 */
function getWorkoutPromptConfig(workoutType: WorkoutType): PromptConfig {
  if (!workoutPromptCache.has(workoutType)) {
    workoutPromptCache.set(workoutType, loadUserPrompt(`${workoutType}_workout`));
  }
  return workoutPromptCache.get(workoutType)!;
}

/**
 * Transform workout input to prompt input format.
 * Handles optional fields and formats values for prompt interpolation.
 */
function toPromptInput(input: WorkoutInput): Record<string, string | number> {
  const base = {
    user_age: input.user.age,
    user_weight: input.user.weight,
    user_weight_unit: input.user.weight_unit,
    user_fitness_level: input.user.fitness_level,
    user_physical_limitations: input.user.physical_limitations || 'None reported',
    workout_duration: input.workout_duration,
    equipment_access: input.equipment_access,
    equipment_notes: input.equipment_notes || 'None specified',
  };

  switch (input.workout_type) {
    case WorkoutTypeSchema.enum.hypertrophy:
      return {
        ...base,
        target_muscle_group: input.target_muscle_group,
        tempo_focus: input.tempo_focus ? 'true' : 'false',
        weight_progression_pattern: input.weight_progression_pattern,
      };

    case WorkoutTypeSchema.enum.strength:
      return {
        ...base,
        target_muscle_group: input.target_muscle_group,
        load_percentage: input.load_percentage?.toString() || 'Auto-select based on fitness level',
        weight_progression_pattern: input.weight_progression_pattern,
      };

    case WorkoutTypeSchema.enum.conditioning:
      return {
        ...base,
        interval_structure: input.interval_structure,
        cardio_modality: input.cardio_modality,
        distance_time_goal: input.distance_time_goal || 'None specified',
      };

    default:
      throw new Error(`Unknown workout type: ${(input as WorkoutInput).workout_type}`);
  }
}

/**
 * Get the appropriate output schema for a workout type.
 * Cast to ZodType<WorkoutOutput> since the specific subtype is selected correctly at runtime.
 */
function getOutputSchema(workoutType: WorkoutType): z.ZodType<WorkoutOutput> {
  switch (workoutType) {
    case WorkoutTypeSchema.enum.hypertrophy:
      return HypertrophyOutputSchema as unknown as z.ZodType<WorkoutOutput>;
    case WorkoutTypeSchema.enum.strength:
      return StrengthOutputSchema as unknown as z.ZodType<WorkoutOutput>;
    case WorkoutTypeSchema.enum.conditioning:
      return ConditioningOutputSchema as unknown as z.ZodType<WorkoutOutput>;
    default:
      throw new Error(`Unknown workout type: ${workoutType}`);
  }
}

/**
 * Generate a workout using the Anthropic SDK with structured output.
 */
export async function generateWorkout(rawInput: unknown): Promise<WorkoutGeneratorResult> {
  const input = WorkoutInputSchema.parse(rawInput);

  const systemPrompt = getSystemPrompt('fitness_trainer');
  const userPromptConfig = getWorkoutPromptConfig(input.workout_type);
  const promptInput = toPromptInput(input);

  validatePromptVariables(userPromptConfig, promptInput);

  const userContent = interpolatePrompt(userPromptConfig.content, promptInput);

  const outputSchema = getOutputSchema(input.workout_type);
  const toolName = `${input.workout_type}_workout`;

  const workout = await invokeWithRetry(systemPrompt, userContent, outputSchema, { toolName });

  return {
    workout,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Clear the prompt cache (useful for testing or hot-reloading).
 */
export function clearPromptCache(): void {
  systemPromptCache.clear();
  workoutPromptCache.clear();
}
