# Vercel Serverless Functions Implementation Plan

## Overview

This document outlines the implementation plan for integrating Vercel Serverless Functions into the Trakn application, replacing the previously attempted Supabase Edge Functions approach. The primary driver for this change is the improved developer experience of Node.js/TypeScript over Deno, eliminating dependency management issues and deployment friction.

### Goals

1. Establish a Vercel Functions project within the existing pnpm monorepo
2. Implement the `/api/workouts/generate` endpoint for AI workout generation
3. Use LangChain.js for prompt variable interpolation and structured output enforcement
4. Manage prompt content in YAML files for maintainability and version control
5. Create reusable patterns for authentication, validation, and error handling
6. Configure local development, staging, and production environments
7. Document the architecture for future API expansion

### Non-Goals (Initial Implementation)

- Full CRUD API for all entities (will use direct Supabase client where RLS suffices)
- Database migrations (remains in `supabase/migrations/`)
- Webhook handlers (future phase)
- Scheduled/cron jobs (future phase)

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Vercel                                      │
│  ┌─────────────────────────┐         ┌────────────────────────────────┐ │
│  │   Angular PWA (web)     │         │   /api Serverless Functions    │ │
│  │   • Static assets       │ ──────▶ │   • Workout generation         │ │
│  │   • Client-side routing │         │   • Protected operations       │ │
│  └─────────────────────────┘         │   • Data aggregation           │ │
│                                      └──────────────┬─────────────────┘ │
└─────────────────────────────────────────────────────┼───────────────────┘
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    │                                 │                                 │
                    ▼                                 ▼                                 ▼
          ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
          │   LangChain.js  │             │    Supabase     │             │   Supabase      │
          │   + Anthropic   │             │    Database     │             │   Auth          │
          │   Claude API    │             │    (Postgres)   │             │                 │
          └─────────────────┘             └─────────────────┘             └─────────────────┘
```

### Request Flow: AI Workout Generation

```
1. Angular app collects workout parameters via form
2. User submits → Angular calls POST /api/workouts/generate
3. Request includes Supabase JWT in Authorization header
4. Vercel Function:
   a. Validates JWT via Supabase Auth
   b. Validates request body via Zod (WorkoutInputSchema from trkn-shared)
   c. Optionally fetches user history from Supabase for context
   d. Loads YAML prompt templates and interpolates variables
   e. Uses LangChain ChatPromptTemplate for message construction
   f. Calls Claude via ChatAnthropic.withStructuredOutput() with Zod schema
   g. Returns validated, typed workout to client
5. Angular receives response, can save to Supabase directly via client
```

### Why LangChain.js?

| Feature | Manual Implementation | LangChain.js |
|---------|----------------------|--------------|
| Prompt templating | String interpolation, error-prone | `ChatPromptTemplate` with typed variables |
| Structured output | Manual JSON parsing + Zod validation | `withStructuredOutput(zodSchema)` - automatic |
| Retry logic | Custom implementation | Built-in with configurable retries |
| Model switching | Different API clients | Change one import |
| Streaming | Manual SSE handling | `.stream()` method |
| Observability | Custom logging | LangSmith integration available |

### Why YAML for Prompt Management?

| Benefit | Description |
|---------|-------------|
| Separation of concerns | Prompt content separate from TypeScript logic |
| Version control | Clear diffs when prompt text changes |
| Non-developer editing | Content can be edited without touching code |
| Metadata support | YAML structure supports name, description, version, variables |
| Consistency | Single source of truth for prompt content |

### Decision: What Goes Where

| Operation | Location | Reasoning |
|-----------|----------|-----------|
| AI workout generation | Vercel Function | Protects Claude API key, complex logic |
| Workout CRUD | Angular → Supabase directly | RLS provides security, no server logic needed |
| Plan CRUD | Angular → Supabase directly | RLS provides security |
| Session logging | Angular → Supabase directly | RLS provides security |
| Exercise library queries | Angular → Supabase directly | Read-only, public data |
| User profile updates | Angular → Supabase directly | RLS scoped to user |
| Data aggregation/reporting | Vercel Function (future) | Complex queries, cross-user if needed |
| Webhooks (Stripe, etc.) | Vercel Function (future) | Server-side only |

---

## Project Structure

### Monorepo Integration

```
trakn/
├── apps/
│   ├── web/                    # Angular PWA (existing)
│   └── vercel/                 # Vercel Functions
│       ├── package.json
│       ├── tsconfig.json
│       ├── prompts/            # YAML prompt templates (content)
│       │   ├── system/
│       │   │   └── fitness_trainer.prompt.yml
│       │   ├── hypertrophy_workout.prompt.yml
│       │   ├── strength_workout.prompt.yml
│       │   └── conditioning_workout.prompt.yml
│       ├── src/
│       │   ├── functions/      # Function handlers
│       │   │   └── workouts/
│       │   │       └── generate.ts
│       │   ├── lib/            # Shared utilities
│       │   │   ├── supabase.ts
│       │   │   ├── langchain.ts
│       │   │   ├── prompt-loader.ts   # YAML prompt loading utility
│       │   │   ├── auth.ts
│       │   │   └── errors.ts
│       │   └── chains/         # LangChain chains
│       │       ├── workout-generator.chain.ts
│       │       └── index.ts
│       └── api/                # Vercel function entry points
│           └── workouts/
│               └── generate.ts
├── packages/
│   └── shared/                 # Shared types/schemas (existing)
├── supabase/                   # Database config (existing)
├── vercel.json                 # Vercel configuration
└── pnpm-workspace.yaml
```

### Why This Structure?

1. **`apps/vercel/prompts/`**: YAML files containing prompt content, separate from code
2. **`apps/vercel/src/lib/prompt-loader.ts`**: Utility to load and parse YAML prompts
3. **`apps/vercel/src/chains/`**: LangChain chains that use loaded prompts
4. **`apps/vercel/api/`**: Vercel's required directory for function entry points (thin wrappers)
5. **Testability**: Prompts can be validated independently, chains can be unit tested

---

## YAML Prompt Format

### Prompt File Structure

Each YAML prompt file follows a consistent structure:

```yaml
name: 'Human-readable name'
description: 'What this prompt does'
version: '1.0'
variables:
  - variable_name_1
  - variable_name_2
content: |
  The prompt content with $variable_name_1 placeholders.
  Variables use $ prefix for substitution.
```

### Existing Prompts

The following YAML prompts have been created in `apps/vercel/prompts/`:

#### System Prompt: `system/fitness_trainer.prompt.yml`
- **Purpose**: System prompt establishing AI persona as a practical strength and fitness trainer
- **Key characteristics**: Direct, practical, safety-focused, action-oriented
- **No variables**: Static system context

#### Workout Prompts

| File | Purpose | Key Variables |
|------|---------|---------------|
| `hypertrophy_workout.prompt.yml` | Muscle building workouts | `user_age`, `user_weight`, `target_muscle_group`, `tempo_focus`, `weight_progression_pattern` |
| `strength_workout.prompt.yml` | Strength training workouts | `user_age`, `user_weight`, `target_muscle_group`, `load_percentage`, `weight_progression_pattern` |
| `conditioning_workout.prompt.yml` | Cardio/conditioning workouts | `user_age`, `user_weight`, `interval_structure`, `cardio_modality`, `distance_time_goal` |

### Variable Substitution

YAML prompts use `$variable_name` syntax for variable placeholders. The prompt loader converts these to LangChain's `{variable_name}` format during loading:

```yaml
# In YAML file
content: |
  User is $user_age years old and weighs $user_weight $user_weight_unit.

# After loading (for LangChain)
"User is {user_age} years old and weighs {user_weight} {user_weight_unit}."
```

---

## Implementation Phases

### Phase 1: Project Setup & Configuration

**Duration**: 1-2 hours

#### 1.1 Create the API Package

Create `apps/vercel/` directory structure and initialize the package:

```bash
# From project root
mkdir -p apps/vercel/{src/{functions,lib,chains},api}
# Note: prompts/ directory already exists with YAML files
```

**`apps/vercel/package.json`**:
```json
{
  "name": "trkn-api",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vercel dev",
    "build": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@langchain/anthropic": "^0.3.15",
    "@langchain/core": "^0.3.42",
    "@supabase/supabase-js": "^2.81.1",
    "js-yaml": "^4.1.0",
    "trkn-shared": "workspace:*",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^22.12.0",
    "@vercel/node": "^5.1.8",
    "typescript": "~5.9.2",
    "vercel": "^44.1.0",
    "vitest": "^3.3.3"
  }
}
```

**`apps/vercel/tsconfig.json`**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./src/*"],
      "trkn-shared": ["../../packages/shared/src"]
    },
    "types": ["node"]
  },
  "include": ["src/**/*", "api/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 1.2 Update Workspace Configuration

**Update `pnpm-workspace.yaml`**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'supabase'
```

**Update root `package.json`** (add scripts):
```json
{
  "scripts": {
    "add:api": "pnpm --filter trkn-api add",
    "add:api:dev": "pnpm --filter trkn-api add -D",
    "dev:api": "pnpm --filter trkn-api dev",
    "build:api": "pnpm --filter trkn-api build",
    "test:api": "pnpm --filter trkn-api test",
    "dev:all": "concurrently \"pnpm dev:web\" \"pnpm dev:api\""
  }
}
```

#### 1.3 Create Vercel Configuration

**`vercel.json`** (project root):
```json
{
  "version": 2,
  "buildCommand": "pnpm build:web",
  "outputDirectory": "apps/web/dist/trkn/browser",
  "installCommand": "pnpm install",
  "framework": null,
  "functions": {
    "apps/vercel/api/**/*.ts": {
      "runtime": "@vercel/node@5.1.8",
      "memory": 1024,
      "maxDuration": 30,
      "includeFiles": "apps/vercel/prompts/**/*.yml"
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/apps/vercel/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Authorization,Content-Type" }
      ]
    }
  ]
}
```

> **Note**: The `includeFiles` option ensures YAML prompt files are bundled with the serverless function.

#### 1.4 Environment Variables

**Required Environment Variables**:
```bash
# Supabase (existing)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only

# Anthropic (via LangChain)
ANTHROPIC_API_KEY=sk-ant-...

# Environment
NODE_ENV=development
```

---

### Phase 2: Core Library Implementation

**Duration**: 2-3 hours

#### 2.1 YAML Prompt Loader

**`apps/vercel/src/lib/prompt-loader.ts`**:
```typescript
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to prompts directory (relative to compiled output location)
const PROMPTS_DIR = join(__dirname, '../../prompts');

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
export function loadWorkoutPrompt(
  workoutType: 'hypertrophy' | 'strength' | 'conditioning'
): PromptConfig {
  return loadPrompt(`${workoutType}_workout.prompt.yml`);
}

/**
 * Validate that all required variables are present in the input.
 */
export function validatePromptVariables(
  promptConfig: PromptConfig,
  input: Record<string, unknown>
): void {
  if (!promptConfig.variables) return;
  
  const missing = promptConfig.variables.filter(
    (v) => !(v in input) || input[v] === undefined
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required prompt variables: ${missing.join(', ')}`
    );
  }
}
```

#### 2.2 Supabase Client Factory

**`apps/vercel/src/lib/supabase.ts`**:
```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton for admin operations (bypasses RLS)
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      throw new Error('Missing Supabase configuration');
    }

    adminClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminClient;
}

// Creates a client scoped to the authenticated user (respects RLS)
export function getSupabaseClient(accessToken: string): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Verifies a JWT and returns the user
export async function verifyToken(accessToken: string) {
  const supabase = getSupabaseClient(accessToken);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}
```

#### 2.3 LangChain Client Setup

**`apps/vercel/src/lib/langchain.ts`**:
```typescript
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
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
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
export function getStructuredModel<T extends z.ZodType>(
  schema: T,
  config?: LangChainConfig & { schemaName?: string }
) {
  const model = getChatModel(config);

  return model.withStructuredOutput(schema, {
    name: config?.schemaName ?? 'structured_output',
  });
}

export { z };
```

#### 2.4 Error Handling

**`apps/vercel/src/lib/errors.ts`**:
```typescript
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
        ...(process.env.NODE_ENV !== 'production' && error.details
          ? { details: error.details }
          : {}),
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

  // LangChain errors
  if (error instanceof Error && error.message.includes('Anthropic')) {
    res.status(502).json({
      error: {
        message: 'AI service error',
        code: 'AI_GENERATION_ERROR',
        ...(process.env.NODE_ENV !== 'production'
          ? { details: error.message }
          : {}),
      },
    });
    return;
  }

  // Unknown errors
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}
```

#### 2.5 Authentication Middleware

**`apps/vercel/src/lib/auth.ts`**:
```typescript
import type { VercelRequest } from '@vercel/node';
import type { User } from '@supabase/supabase-js';
import { verifyToken } from './supabase';
import { AuthenticationError } from './errors';

export interface AuthenticatedRequest extends VercelRequest {
  user: User;
  accessToken: string;
}

export async function authenticateRequest(req: VercelRequest): Promise<AuthenticatedRequest> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid Authorization header');
  }

  const accessToken = authHeader.substring(7);
  const user = await verifyToken(accessToken);

  if (!user) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return Object.assign(req, { user, accessToken }) as AuthenticatedRequest;
}
```

---

### Phase 3: LangChain Workout Generator Chain

**Duration**: 2-3 hours

#### 3.1 Workout Generator Chain

**`apps/vercel/src/chains/workout-generator.chain.ts`**:
```typescript
import { RunnableSequence } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { getChatModel } from '@/lib/langchain';
import {
  loadSystemPrompt,
  loadWorkoutPrompt,
  validatePromptVariables,
} from '@/lib/prompt-loader';
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
    systemPromptContent = loadSystemPrompt();
  }
  return systemPromptContent;
}

/**
 * Get the workout prompt content for a specific type (cached).
 */
function getWorkoutPromptContent(
  workoutType: 'hypertrophy' | 'strength' | 'conditioning'
): string {
  if (!workoutPromptCache.has(workoutType)) {
    const promptConfig = loadWorkoutPrompt(workoutType);
    workoutPromptCache.set(workoutType, promptConfig.content);
  }
  return workoutPromptCache.get(workoutType)!;
}

/**
 * Build a ChatPromptTemplate from loaded YAML prompts.
 */
function buildPromptTemplate(
  workoutType: 'hypertrophy' | 'strength' | 'conditioning'
): ChatPromptTemplate {
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
export async function generateWorkout(
  rawInput: unknown
): Promise<WorkoutGeneratorResult> {
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
  const chain = RunnableSequence.from([
    promptTemplate,
    structuredModel,
  ]);

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
```

#### 3.2 Chain Index

**`apps/vercel/src/chains/index.ts`**:
```typescript
export {
  generateWorkout,
  clearPromptCache,
  type WorkoutGeneratorResult,
} from './workout-generator.chain';
```

---

### Phase 4: Workout Generation Function

**Duration**: 1-2 hours

#### 4.1 Core Handler

**`apps/vercel/src/functions/workouts/generate.ts`**:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest } from '@/lib/auth';
import { handleError } from '@/lib/errors';
import { generateWorkout, type WorkoutGeneratorResult } from '@/chains';

export async function handleGenerateWorkout(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    // Only allow POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({ error: { message: 'Method not allowed' } });
      return;
    }

    // Authenticate
    await authenticateRequest(req);

    // Generate workout using LangChain
    const result: WorkoutGeneratorResult = await generateWorkout(req.body);

    // Success response
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
}
```

#### 4.2 Vercel Entry Point

**`apps/vercel/api/workouts/generate.ts`**:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGenerateWorkout } from '../../src/functions/workouts/generate';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return handleGenerateWorkout(req, res);
}
```

---

### Phase 5: Local Development Setup

**Duration**: 1-2 hours

#### 5.1 Environment Configuration

**`apps/vercel/.env.local`** (gitignored):
```bash
# Supabase - Get from `supabase status` when running locally
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic (used by LangChain)
ANTHROPIC_API_KEY=sk-ant-...

# Environment
NODE_ENV=development
```

#### 5.2 Development Workflow

**Running locally**:
```bash
# Terminal 1: Start Supabase
cd supabase && supabase start

# Terminal 2: Start Angular dev server
pnpm dev:web  # Runs on http://localhost:4200

# Terminal 3: Start Vercel API functions
pnpm dev:api  # Runs on http://localhost:3001
```

#### 5.3 Angular Proxy Configuration (Development)

Create **`apps/web/proxy.conf.json`**:
```json
{
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update **`apps/web/angular.json`** serve configuration to include `proxyConfig`.

---

### Phase 6: Angular Integration

**Duration**: 1-2 hours

#### 6.1 API Service

**`apps/web/src/app/core/services/api.service.ts`**:
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, map } from 'rxjs';
import { SupabaseService } from './supabase.service';
import type { WorkoutInput, WorkoutOutput } from 'trkn-shared';

export interface GenerateWorkoutResponse {
  workout: WorkoutOutput;
  generatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly supabase = inject(SupabaseService);

  private readonly baseUrl = '/api';

  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.supabase.client.auth.getSession()).pipe(
      map(({ data }) => {
        if (!data.session?.access_token) {
          throw new Error('Not authenticated');
        }
        return new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session.access_token}`,
        });
      })
    );
  }

  generateWorkout(input: WorkoutInput): Observable<GenerateWorkoutResponse> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<GenerateWorkoutResponse>(
          `${this.baseUrl}/workouts/generate`,
          input,
          { headers }
        )
      )
    );
  }
}
```

---

### Phase 7: Testing Strategy

**Duration**: 2-3 hours

#### 7.1 Unit Tests

**`apps/vercel/src/lib/prompt-loader.test.ts`**:
```typescript
import { describe, it, expect } from 'vitest';
import { loadPrompt, loadSystemPrompt, loadWorkoutPrompt } from './prompt-loader';

describe('Prompt Loader', () => {
  describe('loadSystemPrompt', () => {
    it('should load the fitness trainer system prompt', () => {
      const content = loadSystemPrompt();
      expect(content).toContain('workout plans');
      expect(content).toContain('safety');
    });
  });

  describe('loadWorkoutPrompt', () => {
    it('should load hypertrophy prompt with converted variables', () => {
      const prompt = loadWorkoutPrompt('hypertrophy');
      expect(prompt.name).toBe('Hypertrophy Workout Template');
      expect(prompt.variables).toContain('user_age');
      // Check variable conversion from $var to {var}
      expect(prompt.content).toContain('{user_age}');
      expect(prompt.content).not.toContain('$user_age');
    });

    it('should load strength prompt', () => {
      const prompt = loadWorkoutPrompt('strength');
      expect(prompt.name).toBe('Strength Workout Template');
      expect(prompt.variables).toContain('load_percentage');
    });

    it('should load conditioning prompt', () => {
      const prompt = loadWorkoutPrompt('conditioning');
      expect(prompt.name).toBe('Conditioning Workout Template');
      expect(prompt.variables).toContain('interval_structure');
    });
  });
});
```

**`apps/vercel/src/chains/workout-generator.chain.test.ts`**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { WorkoutInputSchema } from 'trkn-shared';
import { clearPromptCache } from './workout-generator.chain';

describe('Workout Generator Chain', () => {
  beforeEach(() => {
    clearPromptCache();
  });

  describe('Input Validation', () => {
    it('should validate hypertrophy input', () => {
      const validInput = {
        workout_type: 'hypertrophy',
        user_age: 30,
        user_weight: 180,
        user_weight_unit: 'lbs',
        user_fitness_level: 3,
        user_physical_limitations: '',
        workout_duration: 60,
        equipment_access: 'full_gym',
        target_muscle_group: 'chest',
        tempo_focus: true,
        weight_progression_pattern: 'pyramid',
      };

      const result = WorkoutInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject invalid fitness level', () => {
      const invalidInput = {
        workout_type: 'hypertrophy',
        user_age: 30,
        user_weight: 180,
        user_weight_unit: 'lbs',
        user_fitness_level: 10, // Invalid: must be 1-5
        user_physical_limitations: '',
        workout_duration: 60,
        equipment_access: 'full_gym',
        target_muscle_group: 'chest',
        tempo_focus: true,
        weight_progression_pattern: 'pyramid',
      };

      const result = WorkoutInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
```

#### 7.2 Integration Tests

**`apps/vercel/src/chains/workout-generator.chain.integration.test.ts`**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { generateWorkout, clearPromptCache } from './workout-generator.chain';

// Only run if ANTHROPIC_API_KEY is set
const SKIP_INTEGRATION = !process.env.ANTHROPIC_API_KEY;

describe.skipIf(SKIP_INTEGRATION)('Workout Generator Integration', () => {
  beforeEach(() => {
    clearPromptCache();
  });

  it('should generate a valid hypertrophy workout', async () => {
    const input = {
      workout_type: 'hypertrophy' as const,
      user_age: 30,
      user_weight: 180,
      user_weight_unit: 'lbs' as const,
      user_fitness_level: 3,
      user_physical_limitations: '',
      workout_duration: 45,
      equipment_access: 'full_gym' as const,
      target_muscle_group: 'back' as const,
      tempo_focus: false,
      weight_progression_pattern: 'straight_sets' as const,
    };

    const result = await generateWorkout(input);

    expect(result.workout.workout_type).toBe('hypertrophy');
    expect(result.workout.exercises.length).toBeGreaterThan(0);
    expect(result.workout.total_duration_minutes).toBeGreaterThan(0);
    expect(result.generatedAt).toBeDefined();
  }, 60000);

  it('should generate a valid strength workout', async () => {
    const input = {
      workout_type: 'strength' as const,
      user_age: 25,
      user_weight: 200,
      user_weight_unit: 'lbs' as const,
      user_fitness_level: 4,
      user_physical_limitations: '',
      workout_duration: 60,
      equipment_access: 'full_gym' as const,
      target_muscle_group: 'legs' as const,
      load_percentage: 80,
      weight_progression_pattern: 'pyramid' as const,
    };

    const result = await generateWorkout(input);

    expect(result.workout.workout_type).toBe('strength');
    expect(result.workout.exercises.length).toBeGreaterThan(0);
  }, 60000);

  it('should generate a valid conditioning workout', async () => {
    const input = {
      workout_type: 'conditioning' as const,
      user_age: 28,
      user_weight: 165,
      user_weight_unit: 'lbs' as const,
      user_fitness_level: 3,
      user_physical_limitations: '',
      workout_duration: 30,
      equipment_access: 'cardio_machines' as const,
      interval_structure: 'hiit' as const,
      cardio_modality: 'cycling' as const,
    };

    const result = await generateWorkout(input);

    expect(result.workout.workout_type).toBe('conditioning');
    expect(result.workout.intervals.length).toBeGreaterThan(0);
  }, 60000);
});
```

---

### Phase 8: Deployment Configuration

**Duration**: 1-2 hours

#### 8.1 Vercel Project Setup

```bash
# From project root
vercel link

# Follow prompts to:
# 1. Connect to your Vercel account
# 2. Create new project or link existing
# 3. Configure project settings
```

#### 8.2 Environment Variables in Vercel

Set via Vercel Dashboard or CLI:

```bash
# Production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ANTHROPIC_API_KEY production

# Preview (optional - can inherit from production)
vercel env add SUPABASE_URL preview
# ... etc
```

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Create `apps/vercel/src/` directory structure
- [ ] Create `apps/vercel/package.json` with dependencies (including `js-yaml`)
- [ ] Create `apps/vercel/tsconfig.json`
- [ ] Update `pnpm-workspace.yaml`
- [ ] Update root `package.json` scripts
- [ ] Create `vercel.json` with `includeFiles` for YAML prompts
- [ ] Run `pnpm install`
- [ ] Create `.env.local` with development credentials

### Phase 2: Core Libraries
- [ ] Implement `src/lib/prompt-loader.ts` (YAML loading + variable conversion)
- [ ] Implement `src/lib/supabase.ts`
- [ ] Implement `src/lib/langchain.ts`
- [ ] Implement `src/lib/errors.ts`
- [ ] Implement `src/lib/auth.ts`

### Phase 3: LangChain Chain
- [ ] Implement `src/chains/workout-generator.chain.ts` (uses prompt-loader)
- [ ] Implement `src/chains/index.ts`
- [ ] Test chain locally with YAML prompts

### Phase 4: Generation Function
- [ ] Implement `src/functions/workouts/generate.ts`
- [ ] Create `api/workouts/generate.ts` entry point
- [ ] Test locally with `vercel dev`

### Phase 5: Local Development
- [ ] Configure `.env.local`
- [ ] Create Angular proxy configuration
- [ ] Test full flow: Angular → Vercel → YAML prompts → LangChain → Claude → Response

### Phase 6: Angular Integration
- [ ] Create `ApiService` in Angular app
- [ ] Create workout generation UI component

### Phase 7: Testing
- [ ] Write unit tests for prompt-loader
- [ ] Write unit tests for input validation
- [ ] Write integration tests (requires API key)
- [ ] Verify all tests pass

### Phase 8: Deployment
- [ ] Link project to Vercel
- [ ] Configure environment variables
- [ ] Verify YAML files are bundled (check `includeFiles`)
- [ ] Deploy to preview
- [ ] Test preview deployment
- [ ] Deploy to production

### Documentation
- [ ] Update CLAUDE.md
- [ ] Document YAML prompt format
- [ ] Document API endpoints

---

## Future Enhancements

### Prompt Versioning (Future)
- Track prompt versions in YAML metadata
- Log which prompt version generated each workout
- A/B testing different prompt versions

### RAG Integration (Future)
- Fetch user workout history before generation
- Use LangChain's retrieval chains for context injection
- Vector search for exercise recommendations via Supabase pgvector

### Streaming Support (Future)
- Stream generation progress to client
- Use Server-Sent Events (SSE) for real-time updates
- Progressive UI rendering

### Additional Prompts (Future)
- `plan_generator.prompt.yml` - Multi-week training plans
- `exercise_suggestion.prompt.yml` - Exercise recommendations
- `workout_modifier.prompt.yml` - Adjust existing workouts

---

## Appendix: Key Decisions & Rationale

### Why YAML for Prompts?

1. **Separation of concerns**: Prompt content is separate from TypeScript business logic
2. **Version control**: YAML changes show clear diffs in git history
3. **Metadata support**: Name, description, version, and variable lists in one file
4. **Non-developer friendly**: Prompt engineers can edit YAML without touching code
5. **Consistency**: All prompts follow the same format

### Why `$variable` Syntax in YAML?

The YAML prompts use `$variable_name` instead of `{variable_name}` because:
1. **YAML compatibility**: Curly braces have special meaning in some YAML contexts
2. **Readability**: `$variable` is familiar from shell scripts and other templating
3. **Conversion**: The prompt-loader converts to LangChain's `{variable}` format automatically

### Why Cache Loaded Prompts?

The `workout-generator.chain.ts` caches loaded prompts because:
1. **Performance**: Avoid repeated file reads on each request
2. **Serverless**: Function instances may handle multiple requests
3. **Testing**: `clearPromptCache()` allows cache reset for testing

### Why LangChain.js over Direct Anthropic SDK?

| Factor | Direct SDK | LangChain.js |
|--------|-----------|--------------|
| Structured output | Manual JSON parsing + validation | `withStructuredOutput(zodSchema)` automatic |
| Prompt management | String templates | `ChatPromptTemplate` with typed variables |
| Retry logic | Custom implementation | Built-in, configurable |
| Model portability | Anthropic-specific | Easy to swap providers |
| Future features | Manual implementation | RAG, agents, memory built-in |
