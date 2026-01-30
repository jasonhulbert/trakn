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
 * First escapes all literal { and } as {{ and }} so LangChain's f-string
 * parser doesn't choke on JSON examples in the prompt content.
 */
function convertVariableSyntax(content: string): string {
  // 1. Escape all existing braces so they're treated as literals by LangChain
  let escaped = content.replace(/\{/g, '{{').replace(/\}/g, '}}');
  // 2. Convert $variable to {variable} (single braces = LangChain interpolation)
  escaped = escaped.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
  return escaped;
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
 * Validate that all required variables are present in the input.
 */
export function validatePromptVariables(promptConfig: PromptConfig, input: Record<string, unknown>): void {
  if (!promptConfig.variables) return;

  const missing = promptConfig.variables.filter((v) => !(v in input) || input[v] === undefined);

  if (missing.length > 0) {
    throw new Error(`Missing required prompt variables: ${missing.join(', ')}`);
  }
}
