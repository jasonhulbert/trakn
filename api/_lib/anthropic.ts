import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

let clientInstance: Anthropic | null = null;

export interface ClaudeConfig {
  model?: string;
  maxTokens?: number;
}

const DEFAULT_MODEL = process.env.ANTHROPIC_DEFAULT_MODEL ?? 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 0.3;

/**
 * Get a singleton Anthropic client instance.
 */
export function getAnthropicClient(): Anthropic {
  if (!clientInstance) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable');
    }
    clientInstance = new Anthropic({ apiKey });
  }
  return clientInstance;
}

export interface StructuredRequestParams<T extends z.ZodType> {
  system: string;
  userContent: string;
  schema: T;
  toolName: string;
  /**
   * Override the tools array. Defaults to a single tool derived from `schema`.
   * Useful for future multi-tool patterns (e.g. parameter conflict evaluation,
   * safety concern evaluation).
   */
  tools?: Anthropic.Tool[];
  /**
   * Override the tool_choice. Defaults to forced single-tool use.
   */
  tool_choice?: Anthropic.ToolChoice;
  config?: ClaudeConfig;
}

/**
 * Build Claude API request params for structured output via tool use.
 * By default forces a single tool call matching the provided Zod schema.
 * Callers may pass `tools` and `tool_choice` overrides to support
 * multi-tool patterns in the future.
 */
export function createStructuredRequest<T extends z.ZodType>(
  params: StructuredRequestParams<T>
): Anthropic.MessageCreateParamsNonStreaming {
  const { system, userContent, schema, toolName, tools, tool_choice, config } = params;

  const schemaTool: Anthropic.Tool = {
    name: toolName,
    description: `Output the ${toolName} result`,
    input_schema: z.toJSONSchema(schema) as Anthropic.Tool['input_schema'],
  };

  return {
    model: config?.model ?? DEFAULT_MODEL,
    max_tokens: config?.maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: DEFAULT_TEMPERATURE,
    system,
    messages: [{ role: 'user', content: userContent }],
    tools: tools ?? [schemaTool],
    tool_choice: tool_choice ?? ({ type: 'tool', name: toolName } as Anthropic.ToolChoiceTool),
  };
}
