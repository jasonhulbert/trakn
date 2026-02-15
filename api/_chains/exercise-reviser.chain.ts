import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { getChatModel } from '../_lib/langchain.js';
import { loadSystemPrompt, loadUserPrompt } from '../_lib/prompt-loader.js';
import { ExerciseRevisionInputSchema, type ExerciseRevisionInput, type Exercise, ExerciseSchema } from 'trkn-shared';

// Cache for loaded prompts
const systemPromptCache = new Map<string, string>();
const exerciseRevisionPromptCache = new Map<string, string>();

/**
 * Build a ChatPromptTemplate for exercise revision.
 * Uses the fitness_trainer system prompt and revise_exercise user prompt.
 */
function buildExerciseRevisionPromptTemplate(): ChatPromptTemplate {
  if (!systemPromptCache.has('fitness_trainer')) {
    systemPromptCache.set('fitness_trainer', loadSystemPrompt('fitness_trainer'));
  }

  if (!exerciseRevisionPromptCache.has('revise_exercise')) {
    const promptConfig = loadUserPrompt('revise_exercise');
    exerciseRevisionPromptCache.set('revise_exercise', promptConfig.content);
  }

  const systemContent = systemPromptCache.get('fitness_trainer')!;
  const userTemplate = exerciseRevisionPromptCache.get('revise_exercise')!;

  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemContent),
    HumanMessagePromptTemplate.fromTemplate(userTemplate),
  ]);
}

/**
 * Transform exercise revision input to prompt variables.
 * Includes current exercise state, workout context, and original input.
 */
function toPromptInput(input: ExerciseRevisionInput): Record<string, string | number> {
  // Serialize current exercise and workout context
  const currentExerciseJson = JSON.stringify(input.exercise, null, 2);
  const workoutContextJson = JSON.stringify(input.workout_context, null, 2);

  const originalProfile = input.original_input.user;

  return {
    // Current exercise state
    current_exercise: currentExerciseJson,

    // Full workout context (helps AI maintain coherence)
    workout_context: workoutContextJson,
    workout_type: input.workout_context.workout_type,

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
 * Revise a single exercise using LangChain with structured output.
 *
 * This function:
 * 1. Validates the input against the Zod schema
 * 2. Loads and builds prompt templates from YAML files
 * 3. Creates a model with structured output enforcement
 * 4. Invokes the chain and returns validated output
 */
export async function reviseExercise(rawInput: unknown): Promise<Exercise> {
  // Validate input
  const input = ExerciseRevisionInputSchema.parse(rawInput);

  // Build prompt template
  const promptTemplate = buildExerciseRevisionPromptTemplate();

  // Create model with structured output (using ExerciseSchema)
  const model = getChatModel();
  const structuredModel = model.withStructuredOutput(ExerciseSchema, {
    name: 'revise_exercise',
  });

  // Create the chain: prompt -> model with structured output
  const chain = RunnableSequence.from([promptTemplate, structuredModel]);

  // Transform input to prompt format
  const promptInput = toPromptInput(input);

  // Invoke the chain
  const revisedExercise = await chain.invoke(promptInput);

  return revisedExercise as Exercise;
}

/**
 * Clear the prompt cache (useful for testing).
 */
export function clearExerciseRevisionPromptCache(): void {
  systemPromptCache.clear();
  exerciseRevisionPromptCache.clear();
}
