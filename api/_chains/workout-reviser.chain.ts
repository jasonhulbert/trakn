import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { getChatModel } from '../_lib/langchain.js';
import { loadSystemPrompt, loadUserPrompt } from '../_lib/prompt-loader.js';
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
const revisionPromptCache = new Map<string, string>();

/**
 * Get the output schema for a workout type.
 * Reuses the same logic as workout-generator.chain.ts
 */
function getOutputSchema(workoutType: WorkoutType) {
  switch (workoutType) {
    case WorkoutTypeSchema.enum.hypertrophy:
      return HypertrophyOutputSchema;
    case WorkoutTypeSchema.enum.strength:
      return StrengthOutputSchema;
    case WorkoutTypeSchema.enum.conditioning:
      return ConditioningOutputSchema;
    default:
      throw new Error(`Unknown workout type: ${workoutType}`);
  }
}

/**
 * Build a ChatPromptTemplate for workout revision.
 * Uses the fitness_trainer system prompt and revise_workout user prompt.
 */
function buildRevisionPromptTemplate(): ChatPromptTemplate {
  if (!systemPromptCache.has('fitness_trainer')) {
    systemPromptCache.set('fitness_trainer', loadSystemPrompt('fitness_trainer'));
  }

  if (!revisionPromptCache.has('revise_workout')) {
    const promptConfig = loadUserPrompt('revise_workout');
    revisionPromptCache.set('revise_workout', promptConfig.content);
  }

  const systemContent = systemPromptCache.get('fitness_trainer')!;
  const userTemplate = revisionPromptCache.get('revise_workout')!;

  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemContent),
    HumanMessagePromptTemplate.fromTemplate(userTemplate),
  ]);
}

/**
 * Transform revision input to prompt variables.
 * Includes current workout state, original input fields, and revision instruction.
 */
function toPromptInput(input: WorkoutRevisionInput): Record<string, string | number> {
  // IMPORTANT: The current workout needs to be serialized as a JSON string
  // so the AI can see the full structure in the prompt
  const currentWorkoutJson = JSON.stringify(input.workout, null, 2);

  // Include original user profile fields for context
  const originalProfile = input.original_input.user;

  return {
    // Current state
    current_workout: currentWorkoutJson,
    workout_type: input.workout.workout_type,

    // Original input context (helps AI understand user's needs)
    user_age: originalProfile.age,
    user_weight: originalProfile.weight,
    user_weight_unit: originalProfile.weight_unit,
    user_fitness_level: originalProfile.fitness_level,
    user_physical_limitations: originalProfile.physical_limitations || 'None reported',
    workout_duration: input.original_input.workout_duration,
    equipment_access: input.original_input.equipment_access,
    equipment_notes: input.original_input.equipment_notes || 'None specified',

    // The revision instruction
    revision_text: input.revision_text,
  };
}

/**
 * Revise a workout using LangChain with structured output.
 *
 * This function:
 * 1. Validates the input against the Zod schema
 * 2. Loads and builds prompt templates from YAML files
 * 3. Creates a model with structured output enforcement
 * 4. Invokes the chain and returns validated output
 */
export async function reviseWorkout(rawInput: unknown): Promise<WorkoutGeneratorResult> {
  // Validate input
  const input = WorkoutRevisionInputSchema.parse(rawInput);

  // Build prompt template
  const promptTemplate = buildRevisionPromptTemplate();

  // Get output schema for the workout type
  const outputSchema = getOutputSchema(input.workout.workout_type);

  // Create model with structured output
  const model = getChatModel();
  const structuredModel = model.withStructuredOutput(outputSchema, {
    name: `revise_${input.workout.workout_type}_workout`,
  });

  // Create the chain: prompt -> model with structured output
  const chain = RunnableSequence.from([promptTemplate, structuredModel]);

  // Transform input to prompt format
  const promptInput = toPromptInput(input);

  // Invoke the chain
  const revisedWorkout = await chain.invoke(promptInput);

  return {
    workout: revisedWorkout as WorkoutOutput,
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
