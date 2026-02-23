import { z } from 'zod';
import { getAnthropicClient, createStructuredRequest, type StructuredRequestParams } from './anthropic.js';
import { AIGenerationError } from './errors.js';

/**
 * Format Zod validation errors into a concise correction list for the retry prompt.
 */
function formatZodErrors(error: z.ZodError): string {
  const seen = new Set<string>();
  const lines: string[] = [];

  for (const issue of error.issues) {
    const key = `${issue.code}:${issue.path.join('.')}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const path = issue.path.join('.');
    if (issue.code === 'unrecognized_keys' && 'keys' in issue && Array.isArray(issue.keys)) {
      const fieldList = (issue.keys as string[]).map((k) => `"${k}"`).join(', ');
      lines.push(`- ${path || '(root)'}: Unrecognized field(s) ${fieldList} — remove these fields`);
    } else {
      lines.push(`- ${path || '(root)'}: ${issue.message} (code: ${issue.code})`);
    }
  }

  return lines.join('\n');
}

/**
 * Invoke a structured Claude request with retry on Zod validation failure.
 *
 * Calls Claude with forced tool use and validates the tool response against the
 * provided Zod schema. On ZodError, retries once with correction feedback appended
 * to a fresh user message (new request, not conversation continuation).
 *
 * On exhaustion, throws AIGenerationError.
 */
export async function invokeWithRetry<T>(
  systemPrompt: string,
  userContent: string,
  schema: z.ZodType<T>,
  params: Pick<StructuredRequestParams<z.ZodType<T>>, 'toolName' | 'tools' | 'tool_choice' | 'config'>,
  maxRetries = 1
): Promise<T> {
  const client = getAnthropicClient();

  async function attempt(user: string): Promise<T> {
    const requestParams = createStructuredRequest({
      system: systemPrompt,
      userContent: user,
      schema,
      ...params,
    });

    const response = await client.messages.create(requestParams);

    const toolBlock = response.content.find((b) => b.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      throw new AIGenerationError('No tool use block in Claude response');
    }

    return schema.parse(toolBlock.input);
  }

  // First attempt
  try {
    return await attempt(userContent);
  } catch (firstError) {
    if (!(firstError instanceof z.ZodError) || maxRetries < 1) {
      throw firstError;
    }

    const errorSummary = formatZodErrors(firstError);
    console.warn(
      '[output-parser-retry] Schema validation failed on first attempt — retrying with correction feedback.\n' +
        'Validation errors:\n' +
        errorSummary
    );

    const correctedUser =
      userContent +
      '\n\n---\nCORRECTION REQUIRED: Your previous response failed schema validation. ' +
      'Fix the following issues and respond again with a valid output:\n\n' +
      errorSummary;

    // Retry with fresh request
    try {
      return await attempt(correctedUser);
    } catch (retryError) {
      if (retryError instanceof z.ZodError) {
        throw new AIGenerationError(
          'Failed to generate a valid response after retry. The model did not comply with the output schema.',
          { validationErrors: formatZodErrors(retryError) }
        );
      }
      throw retryError;
    }
  }
}
