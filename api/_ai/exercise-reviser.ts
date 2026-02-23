import { invokeWithRetry } from '../_lib/output-parser-retry.js';
import {
  loadSystemPrompt,
  loadUserPrompt,
  interpolatePrompt,
  validatePromptVariables,
  type PromptConfig,
} from '../_lib/prompt-loader.js';
import { ExerciseRevisionInputSchema, type ExerciseRevisionInput, type Exercise, ExerciseSchema } from 'trkn-shared';

// Cache for loaded prompts
const systemPromptCache = new Map<string, string>();
const exerciseRevisionPromptCache = new Map<string, PromptConfig>();

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
 * Get the exercise revision prompt config (cached).
 */
function getExerciseRevisionPromptConfig(name: string): PromptConfig {
  if (!exerciseRevisionPromptCache.has(name)) {
    exerciseRevisionPromptCache.set(name, loadUserPrompt(name));
  }
  return exerciseRevisionPromptCache.get(name)!;
}

/**
 * Transform exercise revision input to prompt variables.
 * Includes current exercise state, workout context, and original input.
 */
function toPromptInput(input: ExerciseRevisionInput): Record<string, string | number> {
  const currentExerciseJson = JSON.stringify(input.exercise, null, 2);
  const workoutContextJson = JSON.stringify(input.workout_context, null, 2);
  const originalProfile = input.original_input.user;

  return {
    current_exercise: currentExerciseJson,
    workout_context: workoutContextJson,
    workout_type: input.workout_context.workout_type,
    user_age: originalProfile.age,
    user_weight: originalProfile.weight,
    user_weight_unit: originalProfile.weight_unit,
    user_fitness_level: originalProfile.fitness_level,
    user_physical_limitations: originalProfile.physical_limitations || 'None reported',
    equipment_access: input.original_input.equipment_access,
    equipment_notes: input.original_input.equipment_notes || 'None specified',
    revision_text: input.revision_text,
  };
}

/**
 * Revise a single exercise using the Anthropic SDK with structured output.
 */
export async function reviseExercise(rawInput: unknown): Promise<Exercise> {
  const input = ExerciseRevisionInputSchema.parse(rawInput);

  const systemPrompt = getSystemPrompt('fitness_trainer');
  const userPromptConfig = getExerciseRevisionPromptConfig('revise_exercise');
  const promptInput = toPromptInput(input);

  validatePromptVariables(userPromptConfig, promptInput);

  const userContent = interpolatePrompt(userPromptConfig.content, promptInput);

  return invokeWithRetry(systemPrompt, userContent, ExerciseSchema, { toolName: 'revise_exercise' });
}

/**
 * Clear the prompt cache (useful for testing).
 */
export function clearExerciseRevisionPromptCache(): void {
  systemPromptCache.clear();
  exerciseRevisionPromptCache.clear();
}
