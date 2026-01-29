import type { VercelResponse } from '@vercel/node';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super(403, message, 'FORBIDDEN_ERROR');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class AIGenerationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(502, message, 'AI_GENERATION_ERROR', details);
    this.name = 'AIGenerationError';
  }
}

export function handleError(error: unknown, res: VercelResponse): void {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV !== 'production' && error.details ? { details: error.details } : {}),
      },
    });
    return;
  }

  // Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: (error as { issues: unknown[] }).issues,
      },
    });
    return;
  }

  // LangChain / AI generation errors
  if (error instanceof Error) {
    const errorName =
      (error as Error).name ||
      (error as { constructor?: { name?: string } }).constructor?.name ||
      '';
    const isAIGenerationRelatedError =
      typeof errorName === 'string' &&
      (errorName.includes('Anthropic') ||
        errorName.includes('LangChain') ||
        errorName.includes('LLM')) ||
      error.message.includes('Anthropic');

    if (isAIGenerationRelatedError) {
      res.status(502).json({
        error: {
          message: 'AI service error',
          code: 'AI_GENERATION_ERROR',
          ...(process.env.NODE_ENV !== 'production' ? { details: error.message } : {}),
        },
      });
      return;
    }
  }

  // Unknown errors
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}
