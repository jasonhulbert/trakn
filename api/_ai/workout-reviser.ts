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
  WorkoutRevisionInputSchema,
  type WorkoutRevisionInput,
  type WorkoutOutput,
  type WorkoutType,
  WorkoutGeneratorResult,
  HypertrophyOutputSchema,
  StrengthOutputSchema,
  ConditioningOutputSchema,
  WorkoutTypeSchema,
} from 'trkn-shared';

// Cache for loaded prompts
const systemPromptCache = new Map<string, string>();
const revisionPromptCache = new Map<string, PromptConfig>();

/**
 * Get the output schema for a workout type.
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
 * Get the system prompt content (cached).
 */
function getSystemPrompt(name: string): string {
  if (!systemPromptCache.has(name)) {
    systemPromptCache.set(name, loadSystemPrompt(name));
  }
  return systemPromptCache.get(name)!;
}

/**
 * Get the revision prompt config (cached).
 */
function getRevisionPromptConfig(name: string): PromptConfig {
  if (!revisionPromptCache.has(name)) {
    revisionPromptCache.set(name, loadUserPrompt(name));
  }
  return revisionPromptCache.get(name)!;
}

/**
 * Transform revision input to prompt variables.
 * Includes current workout state, original input fields, and revision instruction.
 */
function toPromptInput(input: WorkoutRevisionInput): Record<string, string | number> {
  const currentWorkoutJson = JSON.stringify(input.workout, null, 2);
  const originalProfile = input.original_input.user;

  return {
    current_workout: currentWorkoutJson,
    workout_type: input.workout.workout_type,
    user_age: originalProfile.age,
    user_weight: originalProfile.weight,
    user_weight_unit: originalProfile.weight_unit,
    user_fitness_level: originalProfile.fitness_level,
    user_physical_limitations: originalProfile.physical_limitations || 'None reported',
    workout_duration: input.original_input.workout_duration,
    equipment_access: input.original_input.equipment_access,
    equipment_notes: input.original_input.equipment_notes || 'None specified',
    revision_text: input.revision_text,
  };
}

/**
 * Revise a workout using the Anthropic SDK with structured output.
 */
export async function reviseWorkout(rawInput: unknown): Promise<WorkoutGeneratorResult> {
  const input = WorkoutRevisionInputSchema.parse(rawInput);

  const systemPrompt = getSystemPrompt('fitness_trainer');
  const userPromptConfig = getRevisionPromptConfig('revise_workout');
  const promptInput = toPromptInput(input);

  validatePromptVariables(userPromptConfig, promptInput);

  const userContent = interpolatePrompt(userPromptConfig.content, promptInput);
  const outputSchema = getOutputSchema(input.workout.workout_type);
  const toolName = `revise_${input.workout.workout_type}_workout`;

  const revisedWorkout = await invokeWithRetry(systemPrompt, userContent, outputSchema, { toolName });

  return {
    workout: revisedWorkout,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Clear the prompt cache (useful for testing).
 */
export function clearRevisionPromptCache(): void {
  systemPromptCache.clear();
  revisionPromptCache.clear();
}
