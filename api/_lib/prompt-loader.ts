import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to prompts directory (relative from api/_lib/ up to api/, then into _prompts/)
const PROMPTS_DIR = join(__dirname, '../_prompts');

export interface PromptConfig {
  name: string;
  description: string;
  version: string;
  variables?: string[];
  content: string;
}

/**
 * Load and parse a YAML prompt file.
 * Returns raw content with $variable syntax intact for use with interpolatePrompt().
 */
export function loadPrompt(relativePath: string): PromptConfig {
  const fullPath = join(PROMPTS_DIR, relativePath);

  try {
    const fileContent = readFileSync(fullPath, 'utf-8');
    return yaml.load(fileContent) as PromptConfig;
  } catch (error) {
    throw new Error(`Failed to load prompt from ${relativePath}: ${error}`);
  }
}

/**
 * Load a system prompt by identifier.
 */
export function loadSystemPrompt(identifier: string): string {
  const prompt = loadPrompt(`system/${identifier}.prompt.yml`);
  return prompt.content;
}

/**
 * Load a user prompt by identifier.
 */
export function loadUserPrompt(identifier: string): PromptConfig {
  return loadPrompt(`${identifier}.prompt.yml`);
}

/**
 * Substitute $variable_name occurrences in prompt content with values from vars.
 * Unmatched variables are left as-is. Call validatePromptVariables() first
 * to catch missing variables early.
 */
export function interpolatePrompt(content: string, vars: Record<string, string | number>): string {
  return content.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, name: string) => {
    return name in vars ? String(vars[name]) : match;
  });
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
