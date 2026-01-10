# Trakn Setup Guide

Complete setup instructions to get the app running locally and in production.

## Prerequisites

### Required Software

1. **Node.js 18+** and **PNPM 8+**

   ```bash
   node --version  # Should be 18+
   pnpm --version  # Should be 8+
   ```

2. **Supabase CLI**

   ```bash
   npm install -g supabase
   supabase --version
   ```

3. **Docker Desktop** (required for local Supabase)
   - Download from https://www.docker.com/products/docker-desktop/
   - Ensure Docker is running before starting Supabase

## Local Development Setup

### Step 1: Install Dependencies

```bash
# From project root
pnpm install
```

### Step 2: Initialize Supabase

If this is your first time setting up:

```bash
cd supabase
supabase init  # Only if not already initialized
```

The project already has a `config.toml` with project_id: `pyjvqpverfntkktlnpeb`

### Step 3: Start Local Supabase

```bash
# Make sure Docker is running first!
supabase start
```

This command will:

- Pull necessary Docker images (first time only, ~2-3 minutes)
- Start PostgreSQL, GoTrue (auth), PostgREST (API), and other services
- Output important credentials

**IMPORTANT**: Save the output! You'll see something like:

```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Update Environment Configuration

The local anon key in `apps/web/src/environments/environment.ts` is a placeholder. Update it with the actual key from `supabase start`:

```typescript
// apps/web/src/environments/environment.ts
export const environment = {
  production: false,
  supabaseUrl: 'http://localhost:54321',
  supabaseAnonKey: 'YOUR_ACTUAL_ANON_KEY_FROM_SUPABASE_START',
};
```

**Tip**: You can always get these values again by running:

```bash
supabase status
```

### Step 5: Apply Database Migrations

```bash
# From the supabase directory
supabase db reset
```

This will:

- Drop existing database (if any)
- Run all migrations in order:
  - Create tables (profiles, exercises, workouts, sessions, etc.)
  - Apply Row Level Security policies
  - Seed ~50 exercises
  - Create performance indexes

**Verify migrations worked**:

```bash
# Open Supabase Studio
open http://localhost:54323

# Or check tables via CLI
supabase db diff
```

### Step 6: Start Angular Dev Server

```bash
# From project root
pnpm dev:web
```

Visit **http://localhost:4200**

You should see the login page. The app is now fully configured for local development!

## Configuration Files Reference

### Supabase Configuration

**File**: `supabase/config.toml`

Key settings:

- `project_id = "pyjvqpverfntkktlnpeb"` - Your local project identifier
- API port: `54321`
- Database port: `54322`
- Studio port: `54323`
- Auth providers enabled: Google, Apple (need client IDs for production)

### Angular Environment Files

**Development**: `apps/web/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'http://localhost:54321',
  supabaseAnonKey: '<YOUR_LOCAL_ANON_KEY>',
};
```

**Production**: `apps/web/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  supabaseUrl: '', // Set via build-time env vars
  supabaseAnonKey: '', // Set via build-time env vars
};
```

## Environment Variables (Optional for Local Dev)

For local development, the defaults in `environment.ts` work fine. For production or if you want to use environment variables:

### Create `.env` file (optional)

```bash
# Copy the example
cp .env.example .env
```

### Edit `.env`:

```bash
# Local Supabase (get these from `supabase status`)
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

# OAuth (only needed if testing Google/Apple login)
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_GOOGLE_SECRET=your-google-secret
SUPABASE_AUTH_APPLE_CLIENT_ID=your-apple-client-id
SUPABASE_AUTH_APPLE_SECRET=your-apple-secret

# AI (Phase 3 - not needed yet)
ANTHROPIC_API_KEY=your-anthropic-api-key
```

**Note**: For local dev, OAuth providers aren't required. Email/password auth works out of the box.

## Testing Your Setup

### 1. Verify Supabase is Running

```bash
supabase status
```

Should show all services as "healthy".

### 2. Check Database

Visit Supabase Studio: **http://localhost:54323**

Navigate to:

- **Table Editor** → Should see `exercises` table with ~50 rows
- **Authentication** → Should see "Users" section (empty initially)
- **Database** → **Policies** → Should see RLS policies on all tables

### 3. Test Authentication

1. Visit **http://localhost:4200**
2. Click "Don't have an account? Sign up"
3. Register with email/password
4. Check Inbucket (email tester): **http://localhost:54324**
5. You should see a confirmation email (local Supabase doesn't require confirmation by default)
6. Login with your credentials
7. Should redirect to home page

### 4. Verify IndexedDB

After logging in:

1. Open DevTools → Application → Storage → IndexedDB
2. Should see `TraknDB` database
3. Tables: exercises, workouts, workoutSessions, etc.

## Common Issues & Solutions

### Issue: `supabase start` fails

**Error**: "Docker is not running"

- **Solution**: Start Docker Desktop and wait for it to fully initialize

**Error**: "Port 54321 already in use"

- **Solution**:
  ```bash
  supabase stop
  # Kill any process on port 54321
  lsof -ti:54321 | xargs kill -9
  supabase start
  ```

### Issue: Migrations fail

**Error**: "relation already exists"

- **Solution**: Reset the database
  ```bash
  supabase db reset
  ```

**Error**: "cannot connect to database"

- **Solution**: Ensure Supabase is running
  ```bash
  supabase status
  supabase start
  ```

### Issue: Angular app can't connect to Supabase

**Symptom**: Login fails with network error

**Solution**: Verify environment.ts has correct credentials

```bash
# Get credentials
supabase status

# Update apps/web/src/environments/environment.ts
# with the anon key shown
```

### Issue: CORS errors in browser

**Symptom**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: Ensure you're using `http://localhost:4200` (not `127.0.0.1`)

- Supabase config.toml has `site_url = "http://localhost:4200"`

## Production Deployment Setup

### Step 1: Create Supabase Project

1. Visit https://supabase.com
2. Create new project
3. Note your project credentials:
   - Project URL: `https://[project-id].supabase.co`
   - Anon key: Public API key
   - Service role key: Secret admin key (never expose to client!)

### Step 2: Run Migrations on Production

```bash
# Link to your production project
supabase link --project-ref [your-project-id]

# Push migrations
supabase db push
```

### Step 3: Configure OAuth Providers (Optional)

**Google OAuth**:

1. Supabase Dashboard → Authentication → Providers → Google
2. Enable Google provider
3. Add client ID and secret from Google Cloud Console
4. Add authorized redirect URIs:
   - `https://[project-id].supabase.co/auth/v1/callback`

**Apple OAuth**:

1. Supabase Dashboard → Authentication → Providers → Apple
2. Enable Apple provider
3. Add service ID and key from Apple Developer
4. Configure redirect URI

### Step 4: Configure Build Environment Variables

For Vercel deployment:

```bash
# Vercel environment variables
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[your-production-anon-key]
```

For other platforms, set environment variables according to their documentation.

### Step 5: Update Site URL

In Supabase Dashboard → Authentication → URL Configuration:

- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/auth/callback`

## Quick Start (TL;DR)

If you already have everything installed:

```bash
# 1. Install dependencies
pnpm install

# 2. Start Supabase (ensure Docker is running)
cd supabase && supabase start

# 3. Copy the anon key from output and update:
#    apps/web/src/environments/environment.ts

# 4. Apply migrations
supabase db reset

# 5. Start dev server
cd .. && pnpm dev:web

# 6. Visit http://localhost:4200
```

## Need Help?

- **Supabase Docs**: https://supabase.com/docs/guides/cli
- **Angular Docs**: https://angular.dev
- **Project Context**: See `CLAUDE.md` for architectural decisions
- **Implementation Plan**: See `docs/implementation_plan.md`

## Next Steps

Once your local environment is running:

1. Create an account via the UI
2. Explore Supabase Studio to see your data
3. Check out Phase 2 tasks in `docs/implementation_plan.md`
4. Start building workout features!
