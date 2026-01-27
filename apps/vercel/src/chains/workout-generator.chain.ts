import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { getChatModel } from '@/lib/langchain';
import { loadSystemPrompt, loadUserPrompt } from '@/lib/prompt-loader';
import {
  WorkoutInputSchema,
  HypertrophyOutputSchema,
  StrengthOutputSchema,
  ConditioningOutputSchema,
  type WorkoutInput,
  type WorkoutOutput,
} from 'trkn-shared';

// Cache loaded prompts to avoid repeated file reads
let systemPromptContent: string | null = null;
const workoutPromptCache = new Map<string, string>();

/**
 * Get the system prompt content (cached).
 */
function getSystemPrompt(): string {
  if (!systemPromptContent) {
    systemPromptContent = loadSystemPrompt('fitness_trainer');
  }
  return systemPromptContent;
}

/**
 * Get the workout prompt content for a specific type (cached).
 */
function getWorkoutPromptContent(workoutType: 'hypertrophy' | 'strength' | 'conditioning'): string {
  if (!workoutPromptCache.has(workoutType)) {
    const promptConfig = loadUserPrompt(`${workoutType}_workout`);
    workoutPromptCache.set(workoutType, promptConfig.content);
  }
  return workoutPromptCache.get(workoutType)!;
}

/**
 * Build a ChatPromptTemplate from loaded YAML prompts.
 */
function buildPromptTemplate(workoutType: 'hypertrophy' | 'strength' | 'conditioning'): ChatPromptTemplate {
  const systemContent = getSystemPrompt();
  const userContent = getWorkoutPromptContent(workoutType);

  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemContent),
    HumanMessagePromptTemplate.fromTemplate(userContent),
  ]);
}

/**
 * Transform workout input to prompt input format.
 * Handles optional fields and formats values for prompt interpolation.
 */
function toPromptInput(input: WorkoutInput): Record<string, string | number> {
  const base = {
    user_age: input.user_age,
    user_weight: input.user_weight,
    user_weight_unit: input.user_weight_unit,
    user_fitness_level: input.user_fitness_level,
    user_physical_limitations: input.user_physical_limitations || 'None reported',
    workout_duration: input.workout_duration,
    equipment_access: input.equipment_access,
    equipment_notes: input.equipment_notes || 'None specified',
  };

  switch (input.workout_type) {
    case 'hypertrophy':
      return {
        ...base,
        target_muscle_group: input.target_muscle_group,
        tempo_focus: input.tempo_focus ? 'true' : 'false',
        weight_progression_pattern: input.weight_progression_pattern,
      };

    case 'strength':
      return {
        ...base,
        target_muscle_group: input.target_muscle_group,
        load_percentage: input.load_percentage?.toString() || 'Auto-select based on fitness level',
        weight_progression_pattern: input.weight_progression_pattern,
      };

    case 'conditioning':
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
 */
function getOutputSchema(workoutType: WorkoutInput['workout_type']) {
  switch (workoutType) {
    case 'hypertrophy':
      return HypertrophyOutputSchema;
    case 'strength':
      return StrengthOutputSchema;
    case 'conditioning':
      return ConditioningOutputSchema;
    default:
      throw new Error(`Unknown workout type: ${workoutType}`);
  }
}

export interface WorkoutGeneratorResult {
  workout: WorkoutOutput;
  generatedAt: string;
}

/**
 * Generate a workout using LangChain with structured output.
 *
 * This function:
 * 1. Validates the input against the Zod schema
 * 2. Loads and builds prompt templates from YAML files
 * 3. Creates a model with structured output enforcement
 * 4. Invokes the chain and returns validated output
 */
export async function generateWorkout(rawInput: unknown): Promise<WorkoutGeneratorResult> {
  // Validate input
  const input = WorkoutInputSchema.parse(rawInput);

  // Build prompt template from YAML files
  const promptTemplate = buildPromptTemplate(input.workout_type);

  // Get output schema for workout type
  const outputSchema = getOutputSchema(input.workout_type);

  // Create model with structured output
  const model = getChatModel();
  const structuredModel = model.withStructuredOutput(outputSchema, {
    name: `${input.workout_type}_workout`,
  });

  // Create the chain: prompt -> model with structured output
  const chain = RunnableSequence.from([promptTemplate, structuredModel]);

  // Transform input to prompt format
  const promptInput = toPromptInput(input);

  // Invoke the chain
  const workout = await chain.invoke(promptInput);

  return {
    workout: workout as WorkoutOutput,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Clear the prompt cache (useful for testing or hot-reloading).
 */
export function clearPromptCache(): void {
  systemPromptContent = null;
  workoutPromptCache.clear();
}
