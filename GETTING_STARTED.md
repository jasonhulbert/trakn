# Getting Started

## Prerequisites

- **Node.js** 22.x
- **PNPM** (install via `corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker Desktop** (running, required for local Supabase)
- **Supabase CLI** (`brew install supabase/tap/supabase`)

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start local Supabase:**

   ```bash
   cd supabase
   supabase start
   ```

   Note the `anon key` from the output.

3. **Configure environment:**

   Update `apps/web/src/environments/environment.ts` with the `anon key` from the previous step:

   ```ts
   export const environment = {
     production: false,
     supabaseUrl: 'http://127.0.0.1:54321',
     supabaseAnonKey: '<your-anon-key>',
   };
   ```

4. **Apply database migrations:**

   ```bash
   supabase db reset
   ```

5. **Configure Vercel API environment variables:**

   Copy the example env file and fill in values:

   ```bash
   cp .env.example .env.local
   ```

   Required variables for local API development:

   | Variable | Source |
   | --- | --- |
   | `SUPABASE_URL` | `http://127.0.0.1:54321` |
   | `SUPABASE_ANON_KEY` | From `supabase status` output |
   | `SUPABASE_SERVICE_ROLE_KEY` | From `supabase status` output |
   | `ANTHROPIC_API_KEY` | Your Anthropic API key (required for AI workout generation) |

6. **Start the dev server** (from the project root):

   ```bash
   cd ..
   pnpm dev:web
   ```

   The app runs at [http://localhost:4200](http://localhost:4200).

   To also run the Vercel serverless functions locally:

   ```bash
   pnpm dev:vercel   # API only (requires Vercel CLI: pnpm add -g vercel)
   pnpm dev:all      # Web + API concurrently
   ```

## Other Useful Commands

| Command | Description |
| --- | --- |
| `pnpm build:web` | Production build |
| `pnpm test:web` | Run tests |
| `pnpm lint:all` | Lint all workspaces |
| `pnpm format:all` | Format all code |
| `pnpm build:vercel` | Type-check Vercel functions |
| `pnpm test:vercel` | Run Vercel function tests (Vitest) |
| `pnpm dev:vercel` | Run Vercel functions locally |
| `pnpm dev:all` | Run web + API concurrently |

## Local Supabase Services

| Service | URL |
| --- | --- |
| API | http://127.0.0.1:54321 |
| Studio | http://localhost:54323 |
| Inbucket (email) | http://localhost:54324 |

## Troubleshooting

- **Supabase won't start:** Ensure Docker Desktop is running. Kill conflicting ports with `lsof -ti:54321 | xargs kill -9`, then retry.
- **Migration errors:** Run `supabase db reset` to reapply all migrations from scratch.
- **Build failures:** Clear the Angular cache with `rm -rf .angular/` and rebuild.
