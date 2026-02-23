import { invokeWithRetry } from '../_lib/output-parser-retry.js';
import {
  loadSystemPrompt,
  loadUserPrompt,
  interpolatePrompt,
  validatePromptVariables,
  type PromptConfig,
} from '../_lib/prompt-loader.js';
import { IntervalRevisionInputSchema, type IntervalRevisionInput, type Interval, IntervalSchema } from 'trkn-shared';

// Cache for loaded prompts
const systemPromptCache = new Map<string, string>();
const intervalRevisionPromptCache = new Map<string, PromptConfig>();

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
 * Get the interval revision prompt config (cached).
 */
function getIntervalRevisionPromptConfig(name: string): PromptConfig {
  if (!intervalRevisionPromptCache.has(name)) {
    intervalRevisionPromptCache.set(name, loadUserPrompt(name));
  }
  return intervalRevisionPromptCache.get(name)!;
}

/**
 * Transform interval revision input to prompt variables.
 * Includes current interval state, workout context, and original input.
 */
function toPromptInput(input: IntervalRevisionInput): Record<string, string | number> {
  const currentIntervalJson = JSON.stringify(input.interval, null, 2);
  const workoutContextJson = JSON.stringify(input.workout_context, null, 2);
  const originalProfile = input.original_input.user;

  return {
    current_interval: currentIntervalJson,
    workout_context: workoutContextJson,
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
 * Revise a single interval using the Anthropic SDK with structured output.
 */
export async function reviseInterval(rawInput: unknown): Promise<Interval> {
  const input = IntervalRevisionInputSchema.parse(rawInput);

  const systemPrompt = getSystemPrompt('fitness_trainer');
  const userPromptConfig = getIntervalRevisionPromptConfig('revise_interval');
  const promptInput = toPromptInput(input);

  validatePromptVariables(userPromptConfig, promptInput);

  const userContent = interpolatePrompt(userPromptConfig.content, promptInput);

  return invokeWithRetry(systemPrompt, userContent, IntervalSchema, { toolName: 'revise_interval' });
}

/**
 * Clear the prompt cache (useful for testing).
 */
export function clearIntervalRevisionPromptCache(): void {
  systemPromptCache.clear();
  intervalRevisionPromptCache.clear();
}
