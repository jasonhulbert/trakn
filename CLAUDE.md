# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trakn is an offline-first Progressive Web App (PWA) for strength training tracking, built with Angular 20+ and Supabase. The application eliminates planning overhead by combining straightforward workout creation tools with AI-generated training plans across three workout types: hypertrophy (muscle growth), strength (maximal force), and conditioning (cardiovascular capacity).

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
├── apps/web/              # Angular 20+ PWA application
├── packages/shared/       # Shared TypeScript types and validators
├── supabase/              # Database migrations and Edge Functions
└── docs/                  # Project documentation
```

### Technology Stack

- **Frontend:** Angular 20+ (zoneless change detection), Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Offline Storage:** IndexedDB via Dexie
- **Build Tool:** Angular CLI with esbuild
- **Package Manager:** PNPM (workspace mode)
- **State Management:** RxJS + Angular services (no NgRx/Akita)

### Key Architectural Decisions

**Zoneless Angular:** The app uses `provideZonelessChangeDetection()` instead of Zone.js. All components must explicitly manage change detection via signals or manual change detection.

**Offline-First Sync:** Operations are queued in IndexedDB when offline and synced to Supabase when connectivity resumes. The `IndexedDbService` manages a `syncQueue` table that tracks pending operations.

**Inline Templates/Styles:** Angular schematics are configured to use inline templates and styles for all components (see `angular.json` schematics config). This reduces file proliferation.

**Shared Types:** All TypeScript types shared between frontend and backend live in `packages/shared/src/types/`. Import via `@trakn/shared`.

**Service Worker:** PWA capabilities are enabled via `@angular/service-worker` with configuration in `ngsw-config.json`. Only active in production builds.

## Development Commands

### Initial Setup

```bash
# Install all dependencies
pnpm install

# Start local Supabase (requires Docker running)
cd supabase && supabase start

# Update environment.ts with anon key from supabase start output
# apps/web/src/environments/environment.ts

# Apply database migrations
supabase db reset

# Return to root and start dev server
cd .. && pnpm dev:web
```

### Common Commands

```bash
# Development
pnpm dev:web                 # Start Angular dev server (http://localhost:4200)
pnpm build:web              # Build for production
pnpm test:web               # Run Karma tests

# Linting & Formatting
pnpm lint:all               # Lint all workspaces
pnpm lint:fix:all           # Fix linting issues
pnpm format:all             # Format all code with Prettier
pnpm format:check:all       # Check formatting

# Package Management
pnpm add:web <package>      # Add dependency to apps/web
pnpm add:web:dev <package>  # Add dev dependency to apps/web
pnpm add:shared <package>   # Add dependency to packages/shared
pnpm add:all <package>      # Add to workspace root

# Supabase
cd supabase
supabase start              # Start local Supabase
supabase stop               # Stop local Supabase
supabase status             # Check status and get credentials
supabase db reset           # Reset database and run all migrations
supabase db diff            # Compare local vs remote schema
supabase db push            # Push migrations to production
supabase link --project-ref <id>  # Link to production project
```

### Testing

```bash
# Run all tests
pnpm test:web

# Run tests in watch mode (add --watch to karma config)
pnpm test:web --watch

# Run tests for a specific file pattern
# Update karma.conf.js files property or use --grep flag
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
export class MyService { }
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

### Environment Configuration

- **Development:** `apps/web/src/environments/environment.ts` points to `http://127.0.0.1:54321`
- **Production:** `apps/web/src/environments/environment.prod.ts` uses production Supabase URL
- **Local Credentials:** Get anon key from `supabase status` and update environment.ts

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

Types in `packages/shared/src/types/` must:
- Be framework-agnostic (no Angular/Supabase-specific code)
- Export via `packages/shared/src/index.ts`
- Use TypeScript interfaces/types only

Import pattern:
```typescript
import type { SyncOperation } from '@trakn/shared';
```

## Critical Implementation Notes

### Angular Zoneless Considerations

- All async operations must explicitly trigger change detection or use signals
- Avoid relying on automatic change detection from Zone.js
- Use `ChangeDetectorRef.markForCheck()` when needed

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

- Project Brief: `docs/project_brief.md` (product vision and scope)
- Setup Guide: `docs/setup_guide.md` (detailed setup instructions)
- README: High-level project structure
