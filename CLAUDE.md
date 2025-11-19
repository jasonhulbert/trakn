# Trakn - Project Context for LLMs

This document provides context about the Trakn project to help Claude (and other LLMs) understand the project's intentions, architecture, and decision-making framework. This is a living document that should be updated as the project evolves.

## Project Purpose

Trakn is a workout planning and logging application designed to **remove the planning burden from strength training**. The core philosophy is simplicity and accessibility over feature accumulation. Users should be able to start a workout within seconds, whether by selecting a saved workout or requesting the AI agent generate one.

### Critical Design Principles

1. **Simplicity over features**: Do not add features just because they're common in fitness apps
2. **Accessibility**: Assume users have limited training knowledge
3. **Speed to execution**: Minimize friction between decision to train and active workout
4. **No pseudoscience**: Avoid complex analytics, readiness scores, or questionable metrics
5. **No social features**: This is a personal training tool, not a social network

## What This App Is NOT

- Not a social fitness platform (no sharing, communities, or competition)
- Not an analytics dashboard (no complex charts or performance predictions)
- Not a form coaching tool (no real-time guidance during workouts)
- Not a comprehensive fitness tracker (focuses on strength training only)

See the [project brief](./docs/project_brief.md) for the complete product vision.

## Technical Architecture Overview

### Technology Stack
- **Frontend**: Angular 20+ with TailwindCSS 4+
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI**: Anthropic Claude Sonnet 4 via Supabase Edge Functions
- **Offline**: IndexedDB (via Dexie.js) with Service Workers
- **Deployment**: Vercel (frontend), Supabase hosted (us-east-1)

### Key Architectural Patterns

#### Offline-First Architecture
**Critical**: Users must be able to log entire workouts offline. Gyms have poor connectivity.

```
User Action → IndexedDB (immediate) → UI Update (optimistic) → Sync Queue → Supabase (when online)
```

All data writes go to IndexedDB first. The sync queue handles background synchronization when connectivity is restored.

#### AI Agent Architecture
**Security-First**: AI API keys never exposed to client.

```
Angular App → Supabase Edge Function → Anthropic Claude API
                      ↑
              User context from PostgreSQL
```

Edge Functions assemble user context (history, equipment, preferences) before calling Claude API. Responses stream via Server-Sent Events (SSE).

#### State Management
RxJS Observables for reactive state management. Services combine local (IndexedDB) and remote (Supabase) data sources, preferring local for speed.

## Project Structure

This is a monorepo with the following structure:

```
trakn/
├── apps/web/              # Angular PWA application
├── supabase/              # Edge Functions and database migrations
├── packages/shared/       # Shared TypeScript types
├── scripts/               # Setup and maintenance scripts
└── docs/                  # Additional documentation
```

### Key Directories

- **apps/web/src/app/core/**: Singleton services (auth, offline sync, database)
- **apps/web/src/app/shared/**: Reusable components (timer, exercise selector)
- **apps/web/src/app/features/**: Feature modules (workouts, sessions, AI generator, history, plans)
- **supabase/functions/**: Edge Functions for AI integration
- **supabase/migrations/**: Database schema and RLS policies
- **packages/shared/**: Types shared between frontend and backend

See `implementation_plan.md` for complete project structure.

## Database Schema Key Concepts

### Core Tables
- **exercises**: Library of exercises (name, muscle groups, equipment)
- **workouts**: Workout templates (custom or AI-generated)
- **workout_exercises**: Exercise structure within workouts (sets, reps, rest)
- **workout_sessions**: Actual logged workout instances
- **session_sets**: Individual set performance (reps, weight, completed)
- **training_plans**: Multi-week training programs
- **plan_workouts**: Schedule of workouts within plans

### Important Relationships
- Workouts can be reused across multiple sessions
- Sessions can be ad-hoc (no associated workout template)
- Exercises are referenced, not duplicated
- All user data protected by Row Level Security (RLS)

## AI Agent Context & Prompting

### Context Assembly
When generating workouts, the AI agent receives:
- User's available equipment
- Training frequency (workouts per week)
- Last 10 workouts (for variety)
- Muscle groups trained in last 7 days
- User's last workout date

### AI Response Format
The AI generates workouts as structured JSON:
```json
{
  "name": "Workout name",
  "description": "Brief description",
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": "8-10",
      "rest_seconds": 90,
      "notes": "Form cues"
    }
  ]
}
```

### AI Agent Principles
- Balance push/pull movements
- Avoid training same muscle groups on consecutive days
- Progress from compound to isolation exercises
- Match available equipment
- Target 45-60 minute workouts

## Offline Sync Strategy

### Sync Queue
All offline operations are queued in IndexedDB with:
- Operation type (create, update, delete)
- Table name
- Data payload
- Timestamp
- Retry count

### Conflict Resolution
Last-write-wins based on timestamp comparison. With 1-5 initial users, conflicts are rare. This strategy prioritizes simplicity over complex merge logic.

### Online/Offline Detection
- RxJS Observable tracks connectivity state
- Service worker intercepts requests when offline
- Background sync processes queue when connectivity restored

## Code Style & Conventions

### Angular Conventions
- Use Angular 20+ features (signals, improved reactivity)
- Standalone components (no NgModules)
- Lazy-loaded routes for each feature
- Dependency injection for all services
- Prefer Signals over RxJS where appropriate
- Use RxJS for complex async orchestration

### TypeScript
- Strict mode enabled
- Shared types in `packages/shared`
- Type imports from shared package in both frontend and Edge Functions

### File Naming
- Components: `workout-list.component.ts`
- Services: `workout.service.ts`
- Types: `workout.types.ts`
- Routes: `workouts.routes.ts`

### Component Organization
```
feature/
├── component-name/
│   ├── component-name.component.ts
│   ├── component-name.component.html
│   └── component-name.component.css
├── services/
│   └── feature.service.ts
└── feature.routes.ts
```

## Common Pitfalls to Avoid

### Feature Creep
**Don't add features not in the project brief**. If a feature seems like it would be "nice to have," it probably violates the simplicity principle. Examples of features to avoid:
- Social sharing or comparison
- Complex analytics or charts
- Nutrition tracking
- Cardio workouts
- Recovery metrics or readiness scores

### Premature Optimization
Focus on getting features working before optimizing. The initial user base is 1-5 users. Scalability matters, but not at the expense of shipping quickly.

### Overengineering
Prefer simple solutions that solve the immediate problem. Example: Last-write-wins for sync conflicts is sufficient for the expected user base.

### Ignoring Offline Requirements
Every feature must work offline. If a feature requires connectivity, it must gracefully degrade or be queued for later execution.

## Testing Philosophy

### MVP Testing Priorities
1. **Offline → Online sync**: Critical path, must work reliably
2. **Multi-device sync**: Users expect their data everywhere
3. **AI agent quality**: Responses must reflect sound training principles
4. **Auth flows**: All auth providers (email, Google, Apple) must work

### Post-MVP Testing
- Automated E2E tests
- Unit test coverage for business logic
- Load testing for 100+ users

## Cost Considerations

### Budget Constraints
This is initially a personal project with low cost tolerance. Expected costs:
- Supabase: Free tier (sufficient for <100 users)
- Anthropic Claude API: ~$15-25/month at 100 users
- Vercel: Free tier
- **Total: $10-30/month**

### Cost Optimization Strategies
- Cache AI-generated workouts (avoid regenerating similar workouts)
- Limit context window size (last 10 workouts, not full history)
- Use Claude Sonnet 4 (balanced cost/capability)
- Monitor API usage in first month to validate assumptions

## Open Questions & Decisions Needed

### Exercise Library
**Decision needed**: Seed with curated list vs. allow custom exercises from day 1?
- **Recommendation**: Seed with ~50 common exercises, allow custom additions
- **Rationale**: Reduces initial friction, ensures AI has known exercises to reference

### Unit Preferences
**Decision needed**: Imperial (lbs) only or support metric (kg)?
- **Recommendation**: Support both with user preference
- **Rationale**: Minimal implementation cost, expands potential user base

### AI Feedback Loop
**Decision needed**: Should AI learn from workout completion patterns?
- **Recommendation**: Defer to post-MVP
- **Rationale**: Adds complexity, requires more sophisticated prompt engineering

### History Retention
**Decision needed**: Keep all workout history or archive after X months?
- **Recommendation**: Keep all history indefinitely (for MVP)
- **Rationale**: Storage is cheap, users may want long-term trends

## Security Considerations

### Row Level Security (RLS)
All Supabase tables must have RLS policies. Users should only access their own data. No exceptions.

### API Key Protection
- Claude API key stored in Supabase Edge Function secrets
- Never exposed to client
- Edge Functions validate JWT tokens automatically

### Authentication
- Supabase Auth handles all authentication flows
- Support email/password, Google, and Apple OAuth
- Multi-device sync via Supabase Realtime subscriptions

## Useful References

- **Project Brief**: [project_brief.md](./docs/project_brief.md) - Product vision and scope
- **Implementation Plan**: [implementation_plan.md](./docs/implementation_plan.md) - Complete technical plan
- **Angular Docs**: https://angular.dev/overview
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Anthropic API Docs**: https://docs.anthropic.com/

## Questions to Ask

When you (Claude) are uncertain about implementation decisions, ask:

1. **Does this feature align with the simplicity principle?**
2. **Will this work offline?**
3. **Is this the simplest solution that solves the problem?**
4. **Does this add meaningful value, or is it feature creep?**
5. **Have we consulted the project brief and implementation plan?**

## Working with Jason

### Communication Preferences
- Be direct and constructive
- Ask specific questions when requirements are ambiguous
- Present technical options with clear trade-offs
- Use precise technical terminology
- Provide rationale for recommendations
- Focus on practical implementation concerns

### What to Avoid
- Excessive politeness that obscures directness
- Proposing solutions to non-existent problems
- Assuming preferences without explicit confirmation
- Recommending trendy tech without justification
- Over-explaining obvious concepts

## Version History

- **v1.0** (2025-01-12): Initial creation during planning phase
- Future updates should be documented here as project evolves
