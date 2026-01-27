import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to prompts directory (relative to compiled output location)
const PROMPTS_DIR = join(__dirname, '../../../prompts');

export interface PromptConfig {
  name: string;
  description: string;
  version: string;
  variables?: string[];
  content: string;
}

/**
 * Load and parse a YAML prompt file.
 * Converts $variable syntax to {variable} for LangChain compatibility.
 */
export function loadPrompt(relativePath: string): PromptConfig {
  const fullPath = join(PROMPTS_DIR, relativePath);

  try {
    const fileContent = readFileSync(fullPath, 'utf-8');
    const parsed = yaml.load(fileContent) as PromptConfig;

    // Convert $variable to {variable} for LangChain
    parsed.content = convertVariableSyntax(parsed.content);

    return parsed;
  } catch (error) {
    throw new Error(`Failed to load prompt from ${relativePath}: ${error}`);
  }
}

/**
 * Convert $variable_name to {variable_name} for LangChain interpolation.
 */
function convertVariableSyntax(content: string): string {
  // Match $word_characters but not $$escaped
  return content.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
}

/**
 * Load the system prompt for fitness trainer persona.
 */
export function loadSystemPrompt(): string {
  const prompt = loadPrompt('system/fitness_trainer.prompt.yml');
  return prompt.content;
}

/**
 * Load a workout-type-specific prompt.
 */
export function loadWorkoutPrompt(workoutType: 'hypertrophy' | 'strength' | 'conditioning'): PromptConfig {
  return loadPrompt(`${workoutType}_workout.prompt.yml`);
}

/**
 * Validate that all required variables are present in the input.
 */
export function validatePromptVariables(promptConfig: PromptConfig, input: Record<string, unknown>): void {
  if (!promptConfig.variables) return;

  const missing = promptConfig.variables.filter((v) => !(v in input) || input[v] === undefined);

  if (missing.length > 0) {
    throw new Error(`Missing required prompt variables: ${missing.join(', ')}`);
  }
}
