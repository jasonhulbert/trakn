import { ChatPromptTemplate } from '@langchain/core/prompts';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { AIGenerationError } from './errors.js';

interface ZodIssue {
  code: string;
  keys?: string[];
  path: (string | number)[];
  message: string;
}

interface OutputParserException extends Error {
  lc_error_code: string;
  llmOutput?: string;
  sendToLLM?: boolean;
}

/**
 * Type guard for LangChain OutputParserException.
 * Checks multiple indicators for robustness across LangChain versions.
 */
export function isOutputParserException(error: unknown): error is OutputParserException {
  if (!error || typeof error !== 'object') return false;
  const e = error as Record<string, unknown>;
  return (
    e['lc_error_code'] === 'OUTPUT_PARSING_FAILURE' ||
    (typeof e['name'] === 'string' && e['name'].includes('OutputParser') && 'llmOutput' in e)
  );
}

/**
 * Format Zod validation errors from an OutputParserException into a concise,
 * human-readable correction list. Deduplicates errors with the same code and keys.
 */
export function formatValidationErrors(error: OutputParserException): string {
  const rawMessage = error.message;

  // The Zod issue array is embedded in error.message after "Error: "
  const jsonMatch = rawMessage.match(/Error: (\[[\s\S]*\])/);
  if (!jsonMatch) {
    return rawMessage;
  }

  let issues: ZodIssue[];
  try {
    issues = JSON.parse(jsonMatch[1]) as ZodIssue[];
  } catch {
    return rawMessage;
  }

  // Deduplicate by code + stringified keys
  const seen = new Set<string>();
  const unique = issues.filter((issue) => {
    const key = `${issue.code}:${JSON.stringify(issue.keys ?? [])}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const lines = unique.map((issue) => {
    const path = issue.path.join('.');
    if (issue.code === 'unrecognized_keys' && issue.keys?.length) {
      const fieldList = issue.keys.map((k) => `"${k}"`).join(', ');
      return `- ${path || '(root)'}: Unrecognized field(s) ${fieldList} — remove these fields, they do not exist in the schema`;
    }
    return `- ${path || '(root)'}: ${issue.message} (code: ${issue.code})`;
  });

  return lines.join('\n');
}

/**
 * Invoke a structured output model with a prompt, retrying once on OutputParserException
 * with explicit validation feedback appended to the human message.
 *
 * On retry, the original human message content is preserved and a correction block is
 * appended. This avoids Anthropic's alternating-message constraint while giving the model
 * precise instructions on what to fix.
 *
 * On exhaustion, throws AIGenerationError.
 */
export async function invokeWithRetry<T>(
  promptTemplate: ChatPromptTemplate,
  structuredModel: { invoke: (input: BaseLanguageModelInput) => Promise<T> },
  promptInput: Record<string, string | number>,
  maxRetries = 1
): Promise<T> {
  const formattedMessages = await promptTemplate.formatMessages(promptInput);

  // First attempt
  try {
    return await structuredModel.invoke(formattedMessages);
  } catch (firstError) {
    if (!isOutputParserException(firstError) || maxRetries < 1) {
      throw firstError;
    }

    const errorSummary = formatValidationErrors(firstError);
    console.warn(
      '[output-parser-retry] Schema validation failed on first attempt — retrying with correction feedback.\n' +
        'Validation errors:\n' +
        errorSummary
    );

    // Build correction messages: preserve system + corrected human message
    const [systemMessage, ...rest] = formattedMessages;
    const originalHuman = rest[rest.length - 1];
    const originalContent =
      typeof originalHuman.content === 'string' ? originalHuman.content : JSON.stringify(originalHuman.content);

    const { HumanMessage } = await import('@langchain/core/messages');
    const correctionMessage = new HumanMessage(
      originalContent +
        '\n\n---\nCORRECTION REQUIRED: Your previous response failed schema validation. ' +
        'Fix the following issues and respond again with a valid output:\n\n' +
        errorSummary
    );

    const correctionMessages = systemMessage ? [systemMessage, correctionMessage] : [correctionMessage];

    // Retry attempt
    try {
      return await structuredModel.invoke(correctionMessages);
    } catch (retryError) {
      if (isOutputParserException(retryError)) {
        const retryErrorSummary = formatValidationErrors(retryError);
        throw new AIGenerationError(
          'Failed to generate a valid response after retry. The model did not comply with the output schema.',
          { validationErrors: retryErrorSummary }
        );
      }
      throw retryError;
    }
  }
}
