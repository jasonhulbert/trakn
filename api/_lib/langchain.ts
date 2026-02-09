import { ChatAnthropic } from '@langchain/anthropic';
import { z } from 'zod';

let modelInstance: ChatAnthropic | null = null;

export interface LangChainConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  maxRetries?: number;
}

const DEFAULT_CONFIG: Required<LangChainConfig> = {
  model: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-sonnet-4-5',
  temperature: 0.3,
  maxTokens: 4096,
  maxRetries: 2,
};

/**
 * Get a configured ChatAnthropic instance.
 * Uses singleton pattern for the default configuration.
 */
export function getChatModel(config?: LangChainConfig): ChatAnthropic {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Return singleton for default config
  if (!config && modelInstance) {
    return modelInstance;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }

  const model = new ChatAnthropic({
    apiKey,
    model: mergedConfig.model,
    temperature: mergedConfig.temperature,
    maxTokens: mergedConfig.maxTokens,
    maxRetries: mergedConfig.maxRetries,
  });

  // Cache default instance
  if (!config) {
    modelInstance = model;
  }

  return model;
}

/**
 * Create a model with structured output enforcement.
 * Uses tool-calling under the hood to guarantee schema compliance.
 */
export function getStructuredModel<T extends z.ZodType>(schema: T, config?: LangChainConfig & { schemaName?: string }) {
  const model = getChatModel(config);

  return model.withStructuredOutput(schema, {
    name: config?.schemaName ?? 'structured_output',
  });
}

export { z };
