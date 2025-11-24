# Trakn - Workout Planning & Logging App

An offline-first Progressive Web App (PWA) for strength training tracking, built with Angular 20+ and Supabase.

## Project Structure

```
trakn/
├── apps/web/              # Angular PWA application
├── supabase/              # Edge Functions and database migrations
├── packages/shared/       # Shared TypeScript types
└── docs/                  # Additional documentation
```

## Prerequisites

- Node.js 18+ and PNPM 8+
- Supabase CLI (`npm install -g supabase`)
- Angular CLI 20+ (optional, included in project dependencies)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase Locally

Initialize and start the local Supabase instance:

```bash
cd supabase
supabase init
supabase start
```

This will start a local Supabase instance with:
- Database: `postgresql://postgres:postgres@localhost:54322/postgres`
- API URL: `http://localhost:54321`
- Studio URL: `http://localhost:54323`

### 3. Run Database Migrations

Apply the schema migrations:

```bash
supabase db reset
```

This will:
- Create all tables (profiles, exercises, workouts, sessions, etc.)
- Apply Row Level Security policies
- Seed the exercise library with ~50 common exercises
- Create necessary indexes

### 4. Configure Environment

The local development environment is pre-configured to use the local Supabase instance. For production deployment, you'll need to:

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env`
3. Update with your production Supabase credentials

### 5. Start Development Server

```bash
pnpm dev:web
```

The app will be available at `http://localhost:4200`

## Phase 1 Completion Status

✅ All Phase 1 tasks completed:

1. **Monorepo setup** - PNPM workspaces configured
2. **Angular project** - Angular 20 with PWA support
3. **TailwindCSS** - TailwindCSS 4 configured
4. **Shared types** - TypeScript types shared across frontend and backend
5. **Supabase project** - Database schema, RLS policies, and migrations
6. **Authentication** - Email/password, Google, and Apple OAuth
7. **Database schema** - Complete schema with exercises, workouts, sessions, plans
8. **Routing structure** - Home, workouts, history, and profile routes
9. **IndexedDB** - Dexie.js configured for offline storage
10. **Service worker** - Angular PWA configured

## Key Features (Phase 1)

- **Authentication**: Email/password, Google OAuth, Apple OAuth
- **Offline-first architecture**: IndexedDB with Dexie.js
- **Background sync**: Automatic sync when connection restored
- **Core services**: Auth, Supabase, offline sync
- **Routing**: Lazy-loaded routes with auth guards
- **PWA**: Service worker and manifest configured

## Project Architecture

### Frontend (Angular 20+)
- **Core services**: Singleton services in `apps/web/src/app/core/services/`
  - `auth.service.ts` - Authentication with Supabase
  - `supabase.service.ts` - Supabase client wrapper
  - `offline-sync.service.ts` - Offline queue and sync logic
- **IndexedDB**: `indexed-db.service.ts` - Dexie.js abstraction
- **Guards**: `auth.guard.ts` - Route protection
- **Features**: Lazy-loaded feature modules (auth, home, workouts, history, profile)

### Backend (Supabase)
- **PostgreSQL**: All user data with Row Level Security
- **Migrations**: Version-controlled schema in `supabase/migrations/`
- **Seed data**: ~50 common exercises pre-loaded
- **Edge Functions**: (Phase 3) AI workout generation

### Shared Types
- Located in `packages/shared/src/types/`
- Used by both frontend and Edge Functions
- Ensures type safety across the stack

## Database Schema

Key tables:
- **profiles**: User settings (equipment, training frequency, unit preference)
- **exercises**: Global and custom exercise library
- **workouts**: Workout templates (custom or AI-generated)
- **workout_exercises**: Exercise structure within workouts
- **workout_sessions**: Logged workout instances
- **session_sets**: Individual set performance data
- **training_plans**: Multi-week training programs
- **plan_workouts**: Workout schedule within plans

See `docs/implementation_plan.md` for complete schema details.

## Next Steps (Phase 2)

The foundation is complete! Next phase includes:

1. **Exercise library UI** - Browse and search exercises
2. **Custom workout builder** - Create workout templates
3. **Workout execution** - Active workout session with set logging
4. **Timer component** - Rest period countdown
5. **History view** - Past workout sessions
6. **Sync implementation** - Complete offline-to-online sync flow

## Development Commands

```bash
# Install dependencies
pnpm install

# Start Angular dev server
pnpm dev:web

# Build for production
pnpm build:web

# Run tests
pnpm test:web

# Add dependencies
pnpm add:web <package-name>        # Add to Angular app
pnpm add:shared <package-name>     # Add to shared types
pnpm add:supabase <package-name>   # Add to Supabase functions
```

## Supabase Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (reapply all migrations)
supabase db reset

# Create new migration
supabase migration new <migration-name>

# Apply migrations
supabase db push

# Generate TypeScript types from schema
supabase gen types typescript --local > packages/shared/src/types/database.types.ts
```

## Architecture Decisions

### Offline-First
All data writes go to IndexedDB first, then sync to Supabase when online. This ensures:
- Zero data loss in poor connectivity (gyms)
- Instant UI updates (optimistic updates)
- Background sync when connection restored

### Service Worker
Caches app shell and API responses for offline capability. Configured with:
- Prefetch strategy for app assets
- Lazy loading for images/media
- Fresh-first strategy for API calls with fallback

### Row Level Security
All tables have RLS policies ensuring users can only access their own data. No exceptions.

## Troubleshooting

### Supabase won't start
```bash
supabase stop
supabase start
```

### TypeScript errors with shared types
```bash
cd packages/shared
pnpm run build
```

### Service worker not updating
Clear browser cache and unregister service worker:
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

## Resources

- [Project Brief](./docs/project_brief.md) - Product vision and scope
- [Implementation Plan](./docs/implementation_plan.md) - Complete technical plan
- [CLAUDE.md](./CLAUDE.md) - Context for LLM assistance
- [Angular Docs](https://angular.dev/overview)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## License

Private project - All rights reserved
