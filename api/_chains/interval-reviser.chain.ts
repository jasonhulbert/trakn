import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { getChatModel } from '../_lib/langchain.js';
import { loadSystemPrompt, loadUserPrompt } from '../_lib/prompt-loader.js';
import { IntervalRevisionInputSchema, type IntervalRevisionInput, type Interval, IntervalSchema } from 'trkn-shared';

// Cache for loaded prompts
const systemPromptCache = new Map<string, string>();
const intervalRevisionPromptCache = new Map<string, string>();

/**
 * Build a ChatPromptTemplate for interval revision.
 * Uses the fitness_trainer system prompt and revise_interval user prompt.
 */
function buildIntervalRevisionPromptTemplate(): ChatPromptTemplate {
  if (!systemPromptCache.has('fitness_trainer')) {
    systemPromptCache.set('fitness_trainer', loadSystemPrompt('fitness_trainer'));
  }

  if (!intervalRevisionPromptCache.has('revise_interval')) {
    const promptConfig = loadUserPrompt('revise_interval');
    intervalRevisionPromptCache.set('revise_interval', promptConfig.content);
  }

  const systemContent = systemPromptCache.get('fitness_trainer')!;
  const userTemplate = intervalRevisionPromptCache.get('revise_interval')!;

  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemContent),
    HumanMessagePromptTemplate.fromTemplate(userTemplate),
  ]);
}

/**
 * Transform interval revision input to prompt variables.
 * Includes current interval state, workout context, and original input.
 */
function toPromptInput(input: IntervalRevisionInput): Record<string, string | number> {
  // Serialize current interval and workout context
  const currentIntervalJson = JSON.stringify(input.interval, null, 2);
  const workoutContextJson = JSON.stringify(input.workout_context, null, 2);

  const originalProfile = input.original_input.user;

  return {
    // Current interval state
    current_interval: currentIntervalJson,

    // Full workout context (helps AI maintain coherence)
    workout_context: workoutContextJson,

    // Original user context
    user_age: originalProfile.age,
    user_weight: originalProfile.weight,
    user_weight_unit: originalProfile.weight_unit,
    user_fitness_level: originalProfile.fitness_level,
    user_physical_limitations: originalProfile.physical_limitations || 'None reported',
    equipment_access: input.original_input.equipment_access,
    equipment_notes: input.original_input.equipment_notes || 'None specified',

    // Revision instruction
    revision_text: input.revision_text,
  };
}

/**
 * Revise a single interval using LangChain with structured output.
 *
 * This function:
 * 1. Validates the input against the Zod schema
 * 2. Loads and builds prompt templates from YAML files
 * 3. Creates a model with structured output enforcement
 * 4. Invokes the chain and returns validated output
 */
export async function reviseInterval(rawInput: unknown): Promise<Interval> {
  // Validate input
  const input = IntervalRevisionInputSchema.parse(rawInput);

  // Build prompt template
  const promptTemplate = buildIntervalRevisionPromptTemplate();

  // Create model with structured output (using IntervalSchema)
  const model = getChatModel();
  const structuredModel = model.withStructuredOutput(IntervalSchema, {
    name: 'revise_interval',
  });

  // Create the chain: prompt -> model with structured output
  const chain = RunnableSequence.from([promptTemplate, structuredModel]);

  // Transform input to prompt format
  const promptInput = toPromptInput(input);

  // Invoke the chain
  const revisedInterval = await chain.invoke(promptInput);

  return revisedInterval as Interval;
}

/**
 * Clear the prompt cache (useful for testing).
 */
export function clearIntervalRevisionPromptCache(): void {
  systemPromptCache.clear();
  intervalRevisionPromptCache.clear();
}
