# CLAUDE.md

This file provides guidance to LLMs when working with code in this repository.

## Project Overview

Trakn is an offline-first Progressive Web App (PWA) for strength training tracking, built with Angular 21+ and Supabase. The application eliminates planning overhead by combining straightforward workout creation tools with AI-generated training plans across three workout types: hypertrophy (muscle growth), strength (maximal force), and conditioning (cardiovascular capacity).

**Key Product Principles:**

- Minimize planning friction - users should start a workout within seconds
- Support both manual workout creation and AI-generated plans
- Offline-first architecture with background sync
- Intentionally simple - no social features, no complex analytics, no overwhelming metrics
- Three distinct workout types with type-specific programming principles

## Architecture

### Monorepo Structure (PNPM Workspaces)

```
trakn/
├── api/                   # Vercel serverless function entry points (thin wrappers)
│   └── workouts/
│       └── generate.ts
├── apps/
│   ├── web/               # Angular 21+ PWA application
│   └── vercel/            # Vercel Functions implementation (AI workout generation)
├── packages/shared/       # Shared TypeScript types, Zod schemas, and validators
├── supabase/              # Database migrations and configuration
└── docs/                  # Project documentation
```

### Technology Stack

- **Frontend:** Angular 21+ (zoneless change detection, signals), Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth), Vercel Functions (AI workout generation)
- **AI:** LangChain + Anthropic Claude (structured output via Zod schemas)
- **Validation:** Zod (shared input/output schemas across frontend and backend)
- **Offline Storage:** IndexedDB via Dexie
- **Build Tool:** Angular CLI with esbuild
- **Package Manager:** PNPM (workspace mode)
- **State Management:** Angular signals (preferred) with RxJS as needed (no NgRx/Akita)
- **Testing:** Karma (Angular), Vitest (Vercel Functions)
- **Runtime:** Node.js 22.x

### Key Architectural Decisions

**Zoneless Angular:** The app uses `provideZonelessChangeDetection()` instead of Zone.js. All components must explicitly manage change detection via signals or manual change detection.

**Signals-First State:** Services use Angular signals as the primary reactive primitive. RxJS is available but signals are preferred for component and service state.

**Offline-First Sync:** Operations are queued in IndexedDB when offline and synced to Supabase when connectivity resumes. The `IndexedDbService` manages a `syncQueue` table that tracks pending operations.

**Inline Templates/Styles:** Angular schematics are configured to use inline templates and styles for all components (see `angular.json` schematics config). This reduces file proliferation.

**Shared Types and Schemas:** All TypeScript types and Zod validation schemas shared between frontend and backend live in `packages/shared/src/`. Import via `@trakn/shared`.

**Vercel Functions (not Supabase Edge Functions):** AI workout generation runs on Vercel Functions using LangChain chains with structured output. The `api/` directory at the project root contains thin entry points that delegate to implementation in `apps/vercel/src/`.

**Service Worker:** PWA capabilities are enabled via `@angular/service-worker` with configuration in `ngsw-config.json`. Only active in production builds.

## Vercel Functions (AI Workout Generation)

### Architecture

AI-powered workout generation uses Vercel serverless functions with LangChain and Anthropic Claude. The architecture follows a thin-entry-point pattern:

- **`api/`** (root): Vercel discovers these files as serverless functions. They handle CORS preflight and delegate to handlers in `apps/vercel/`.
- **`apps/vercel/src/functions/`**: HTTP request handlers (authentication, validation, error handling).
- **`apps/vercel/src/chains/`**: LangChain chains that orchestrate prompt loading, model invocation, and structured output parsing.
- **`apps/vercel/src/lib/`**: Shared utilities (Supabase client, ChatAnthropic config, JWT auth, error classes, YAML prompt loader).
- **`apps/vercel/prompts/`**: YAML prompt templates with `$variable` syntax for LangChain interpolation.

### Request Flow

```
Angular App → POST /api/workouts/generate (with JWT)
  → api/workouts/generate.ts (thin entry point)
    → handleGenerateWorkout() (JWT auth + validation)
      → generateWorkout() (LangChain chain)
        → Load YAML prompts (system + workout-type-specific)
        → Build ChatPromptTemplate
        → Invoke ChatAnthropic with withStructuredOutput(zodSchema)
        → Return Zod-validated WorkoutOutput
```

### Prompt Management

Prompts are stored as YAML files in `apps/vercel/prompts/`:

```
prompts/
├── system/
│   └── fitness_trainer.prompt.yml    # System prompt for all workout types
├── hypertrophy_workout.prompt.yml    # Hypertrophy-specific user prompt
├── strength_workout.prompt.yml       # Strength-specific user prompt
└── conditioning_workout.prompt.yml   # Conditioning-specific user prompt
```

Each YAML file contains `name`, `description`, `version`, `variables`, and `content` fields. Variables use `$variable` syntax which the prompt loader converts to `{variable}` for LangChain.

### Shared Schemas (Zod)

Input and output schemas live in `packages/shared/src/models/` and are shared between the Angular frontend and Vercel Functions:

- **Input schemas:** Discriminated union on `workout_type` (hypertrophy, strength, conditioning) with a shared `BaseWorkoutInputSchema` and `UserProfileSchema`
- **Output schemas:** Type-specific workout output schemas with exercises, sets, warmup/cooldown, and workout metadata
- **Common schemas:** Equipment access levels, target muscle groups, weight units, progression patterns

### Error Handling

Custom error hierarchy in `apps/vercel/src/lib/errors.ts`:

- `ApiError` (base), `ValidationError` (400), `AuthenticationError` (401), `ForbiddenError` (403), `NotFoundError` (404), `AIGenerationError` (502)
- Environment-aware detail disclosure (full details in development, sanitized in production)

### Deployment Configuration

`vercel.json` configures:

- Functions runtime: `@vercel/node@5.1.8`, 1024MB memory, 30s max duration
- YAML prompts bundled via `includeFiles: apps/vercel/prompts/**/*.yml`
- SPA rewrite: all non-API routes → `/index.html`
- CORS headers for `/api/*` routes

## Development Commands

### Initial Setup

```bash
# Install all dependencies (also generates environment.ts via postinstall)
pnpm install

# Start local Supabase (requires Docker running)
cd supabase && supabase start

# Copy .env.example to .env.local and fill in values from supabase start output
cp .env.example .env.local

# Apply database migrations
supabase db reset

# Return to root and start dev server (regenerates environment.ts from .env.local)
cd .. && pnpm dev:web
```

### Common Commands

```bash
# Development
pnpm dev:web                 # Start Angular dev server (http://localhost:4200)
pnpm dev:vercel              # Start Vercel Functions dev server
pnpm dev:all                 # Start both Angular + Vercel concurrently
pnpm build:web               # Build Angular for production
pnpm build:vercel            # Type-check Vercel Functions

# Testing
pnpm test:web                # Run Karma tests (Angular)
pnpm test:vercel             # Run Vitest tests (Vercel Functions)

# Linting & Formatting
pnpm lint:all                # Lint all workspaces
pnpm lint:fix:all            # Fix linting issues
pnpm format:all              # Format all code with Prettier
pnpm format:check:all        # Check formatting

# Package Management
pnpm add:web <package>       # Add dependency to apps/web
pnpm add:web:dev <package>   # Add dev dependency to apps/web
pnpm add:vercel <package>    # Add dependency to apps/vercel
pnpm add:vercel:dev <package># Add dev dependency to apps/vercel
pnpm add:shared <package>    # Add dependency to packages/shared
pnpm add:all <package>       # Add to workspace root

# Supabase
cd supabase
supabase start               # Start local Supabase
supabase stop                # Stop local Supabase
supabase status              # Check status and get credentials
supabase db reset            # Reset database and run all migrations
supabase db diff             # Compare local vs remote schema
supabase db push             # Push migrations to production
supabase link --project-ref <id>  # Link to production project
```

### Testing

```bash
# Angular tests
pnpm test:web
pnpm test:web --watch

# Vercel Functions tests
pnpm test:vercel
```

## Project-Specific Conventions

### Component Generation

Components are configured to use inline templates and styles by default:

```bash
# This creates a component with inlineTemplate: true, inlineStyle: true
ng generate component features/my-feature

# If you need separate files (rare), use:
ng generate component features/my-feature --inline-template=false --inline-style=false
```

### Service Patterns

All services use `providedIn: 'root'` for singleton behavior:

```typescript
@Injectable({
  providedIn: 'root',
})
export class MyService {}
```

### Supabase Integration

The `SupabaseService` provides a centralized client:

```typescript
constructor(private supabase: SupabaseService) {
  // Use supabase.auth for authentication
  // Use supabase.from('table') for data access
}
```

### Offline Sync Pattern

When performing data mutations:

1. Write to IndexedDB immediately (optimistic update)
2. Add operation to sync queue via `IndexedDbService.addToSyncQueue()`
3. Attempt background sync via `OfflineSyncService`
4. On sync success, remove from queue

### Route Guards

The app uses functional guards for access control:

- **`authGuard`**: Waits for auth initialization, then redirects unauthenticated users to `/auth/login`
- **`comingSoonGuard`**: Redirects all routes to `/coming-soon` when `environment.maintenanceMode` is `true`
- **`comingSoonPageGuard`**: Redirects `/coming-soon` to `/` when maintenance mode is `false`

### Environment Configuration

`apps/web/src/environments/environment.ts` is **generated** by `scripts/set-env.js` and gitignored. Never edit it manually. The script runs automatically during `pnpm install`, `pnpm dev:web`, and `pnpm build:web`.

**Variable resolution priority:** `process.env` > `.env.local` > built-in defaults.

- **Local development:** Copy `.env.example` to `.env.local` and fill in credentials from `supabase status`
- **Production (Vercel):** Configure environment variables in Vercel Project Settings > Environment Variables
- **Generated properties:** `production` (from `NODE_ENV`), `maintenanceMode` (from `MAINTENANCE_MODE`), `supabaseUrl` (from `SUPABASE_URL`), `supabaseAnonKey` (from `SUPABASE_ANON_KEY`)

**Required environment variables:**

| Variable                    | Description                                  | Local Default            |
| --------------------------- | -------------------------------------------- | ------------------------ |
| `SUPABASE_URL`              | Supabase API URL                             | `http://127.0.0.1:54321` |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key                       | From `supabase status`   |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (Vercel Functions) | From `supabase status`   |
| `ANTHROPIC_API_KEY`         | Anthropic API key (Vercel Functions)         | —                        |
| `MAINTENANCE_MODE`          | Enable maintenance/coming-soon page          | `false`                  |
| `NODE_ENV`                  | Environment mode                             | `development`            |

### Database Migrations

All schema changes go in `supabase/migrations/` as timestamped SQL files:

```bash
# Create new migration
supabase migration new migration_name

# Edit the generated SQL file, then:
supabase db reset  # Apply locally
```

Migration naming: `YYYYMMDDHHMMSS_descriptive_name.sql`

### Shared Types

Types and schemas in `packages/shared/src/` must:

- Be framework-agnostic (no Angular/Supabase-specific code)
- Export via `packages/shared/src/index.ts`
- Use TypeScript interfaces/types and Zod schemas

Import pattern:

```typescript
import type { SyncOperation } from '@trakn/shared';
import { WorkoutInputSchema } from '@trakn/shared';
```

## Critical Implementation Notes

### Angular Zoneless Considerations

- All async operations must explicitly trigger change detection or use signals
- Avoid relying on automatic change detection from Zone.js
- Prefer signals over `ChangeDetectorRef.markForCheck()` for new code

### PWA Service Worker

- Service worker only registers in production (`enabled: !isDevMode()`)
- Configuration in `apps/web/ngsw-config.json`
- Test PWA features with production builds: `pnpm build:web && http-server dist/trakn`

### Supabase Local Development

- Local Supabase runs on ports: API 54321, DB 54322, Studio 54323
- Email testing via Inbucket: http://localhost:54324
- Auth confirmations disabled locally (see `config.toml` auth.email.enable_confirmations)
- OAuth providers (Google, Apple) require credentials in production only

### Row Level Security (RLS)

All Supabase tables must have RLS policies. When adding new tables:

1. Create table migration
2. Add RLS policies in same or separate migration
3. Test access patterns in Supabase Studio

### Budget Constraints

Production builds enforce bundle budgets (see `angular.json`):

- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error

Keep bundle size minimal by avoiding large third-party libraries.

## Common Tasks

### Adding a New Feature

1. Create feature directory: `apps/web/src/app/features/feature-name/`
2. Generate component: `ng generate component features/feature-name`
3. Add routing in `app.routes.ts` or feature-specific `feature-name.routes.ts`
4. Create necessary services in `apps/web/src/app/core/services/`
5. Add database tables via new migration if needed
6. Update shared types in `packages/shared/` if needed

### Adding a New API Endpoint

1. Create handler in `apps/vercel/src/functions/` following existing patterns
2. Create thin entry point in `api/` that delegates to the handler
3. Add input/output Zod schemas in `packages/shared/src/models/`
4. Export new schemas from `packages/shared/src/index.ts`
5. Add YAML prompt templates in `apps/vercel/prompts/` if AI-powered
6. Add tests in `apps/vercel/` using Vitest

### Adding a Database Table

1. Create migration: `supabase migration new add_table_name`
2. Write SQL in generated file
3. Apply locally: `supabase db reset`
4. Verify in Supabase Studio: http://localhost:54323
5. Add RLS policies in same or separate migration

### Updating Dependencies

```bash
# Update Angular
ng update @angular/cli @angular/core

# Update specific package in workspace
pnpm --filter trkn-web update <package>

# Update all workspaces
pnpm -r update
```

## Troubleshooting

### Supabase Won't Start

- Ensure Docker Desktop is running
- Check port conflicts: `lsof -ti:54321 | xargs kill -9`
- Reset Supabase: `supabase stop && supabase start`

### Migration Errors

- Always run `supabase db reset` to apply migrations from scratch
- Check migration order (they run alphabetically by filename)
- Verify SQL syntax in Supabase Studio SQL editor

### CORS Issues

- Ensure dev server uses `http://localhost:4200` (not `127.0.0.1`)
- Check `config.toml` has correct `site_url`

### Build Failures

- Check bundle size (see Budget Constraints above)
- Run `pnpm lint:all` to catch linting errors
- Clear Angular cache: `rm -rf .angular/`

## Documentation References

- Project Brief: `docs/PROJECT_BRIEF.md` (product vision and scope)
- Setup Guide: `docs/SETUP_GUIDE.md` (detailed setup instructions)
- Vercel API Plan: `docs/VERCEL_API_IMPLEMENTATION_PLAN.md` (AI workout generation architecture)
- README: High-level project structure
