# Implementation Plan: New Workout Feature

## Pre-Phase Work (Completed)

### UserProfile schema refactor

The `UserProfileSchema` was refactored to remove `user_` prefixes and nest the profile under a `user` property in `BaseWorkoutInputSchema`.

**Changes made:**

- `UserProfileSchema` fields renamed: `user_age` → `age`, `user_weight` → `weight`, `user_weight_unit` → `weight_unit`, `user_fitness_level` → `fitness_level`, `user_physical_limitations` → `physical_limitations`
- `BaseWorkoutInputSchema` changed from flat `UserProfileSchema.extend({ workout_duration })` to `z.object({ user: UserProfileSchema, workout_duration })`
- `toPromptInput()` in `workout-generator.chain.ts` updated to read from `input.user.age` etc. (prompt variable keys remain `user_age` for YAML interpolation)
- All test mock inputs updated to nested structure

**Impact:** This eliminates the need for a separate `UserProfileDbSchema` or `toPromptProfile()` mapper originally planned in Phase 1. The `UserProfileSchema` field names now match clean database column names directly, and the `toPromptInput()` mapping in the chain already handles the translation to prompt variable names.

---

## Technical Concerns

### Concern: Workout persistence schema design

Generated workouts use a discriminated union (`WorkoutOutput`) with type-specific shapes (exercises vs. intervals, different metadata fields). Storing this in Supabase requires a decision about table structure.

**Impact:** A normalized schema (separate tables for exercises, sets, intervals) is complex and may not be worth it at this stage. A denormalized approach (storing the full workout JSON in a `jsonb` column) is simpler and matches the current data flow.

**Recommendation:** Use a single `workouts` table with a `data` column of type `jsonb` that stores the full `WorkoutOutput` object, plus indexed metadata columns (`workout_type`, `created_at`, `user_id`). This matches the AI-generation flow where the entire workout is produced as a unit. Normalization can happen later if query patterns demand it.

### Concern: Revision endpoints and conversation context

The "revise workout" and "revise exercise" endpoints will send the full original input + current state + revision text to the AI. This can result in large prompts, especially for conditioning workouts with many intervals.

**Impact:** Token usage increases. However, given the 4096 max output tokens and workout sizes, this should remain well within Claude's context window.

**Recommendation:** Proceed with full context. Add a reasonable max length on the revision text input (e.g., 500 characters) to prevent abuse, and document the expected payload sizes.

---

## Phase 1: Database Schema & Shared Types

**Objective:** Create the Supabase database tables for user profiles and workouts, and add any new shared schemas needed for the revision endpoints and persistence.

**Key Deliverables:**

- Supabase migration: `user_profiles` table (id, user_id FK to auth.users, age, weight, weight_unit, fitness_level, physical_limitations, created_at, updated_at) with RLS policies
- Supabase migration: `workouts` table (id, user_id FK to auth.users, workout_type, data jsonb, input jsonb, created_at, updated_at) with RLS policies
- New shared schemas in `packages/shared`: `WorkoutRevisionInputSchema`, `ExerciseRevisionInputSchema`
- Export all new schemas from `packages/shared/src/index.ts`

**Dependencies:**

- None - this is the foundational phase

**Estimated Complexity:** M

- **Justification:** Straightforward SQL migrations and Zod schema definitions following existing patterns.

**Risks & Mitigations:**

- **Risk:** RLS policies may be too restrictive or too permissive → **Mitigation:** Each table should have simple user-scoped policies (`auth.uid() = user_id`) for all operations. Test with Supabase Studio.
- **Risk:** `jsonb` column for workout data may need indexing later → **Mitigation:** Add a GIN index on `data` column if query patterns emerge, but defer for now.

**Validation Criteria:**

- Tables visible in Supabase Studio with correct columns and types
- RLS policies prevent cross-user access (test with two different auth tokens)
- New Zod schemas compile and validate correctly (verify with unit tests or manual parse calls)
- `packages/shared` builds without errors: `pnpm build:vercel`

**Technical Notes:**

- Migration files go in `supabase/migrations/` with timestamp prefix
- `user_profiles` should use `auth.uid()` for the user_id default value
- `user_profiles` columns match the `UserProfileSchema` field names directly: `age`, `weight`, `weight_unit`, `fitness_level`, `physical_limitations`
- `workouts.input` stores the original `WorkoutInput` used for generation (needed for revision endpoints with full context)
- `WorkoutRevisionInputSchema`: `{ workout: WorkoutOutputSchema, original_input: WorkoutInputSchema, revision_text: z.string().max(500) }`
- `ExerciseRevisionInputSchema`: `{ exercise: ExerciseSchema, workout_context: WorkoutOutputSchema, original_input: WorkoutInputSchema, revision_text: z.string().max(500) }`

### Phase 1 File Manifest

| Action | File Path                                                                       | Description                    |
| ------ | ------------------------------------------------------------------------------- | ------------------------------ |
| Create | `supabase/migrations/YYYYMMDDHHMMSS_create_user_profiles.sql`                   | User profiles table + RLS      |
| Create | `supabase/migrations/YYYYMMDDHHMMSS_create_workouts.sql`                        | Workouts table + RLS           |
| Create | `packages/shared/src/models/workout-revision/workout-revision-input.schema.ts`  | Revision input schema          |
| Create | `packages/shared/src/models/workout-revision/exercise-revision-input.schema.ts` | Exercise revision input schema |
| Create | `packages/shared/src/models/workout-revision/index.ts`                          | Barrel export                  |
| Modify | `packages/shared/src/models/index.ts`                                           | Add new barrel exports         |
| Modify | `packages/shared/src/index.ts`                                                  | Ensure new models are exported |

---

## Phase 2: User Profile Feature (Angular)

**Objective:** Build the user profile management UI and service layer in the Angular app, allowing users to create and edit their profile. Profile data is persisted to Supabase with an IndexedDB cache for offline access.

**Key Deliverables:**

- `UserProfileService` in `core/services/` - manages profile CRUD with Supabase, caches in IndexedDB, exposes profile as a signal
- IndexedDB schema update in `IndexedDbService` - add `userProfiles` table (Dexie version bump)
- Profile feature module: `features/profile/` with profile form component
- Profile route added to `app.routes.ts`
- Navigation update: add profile link/icon to home component nav bar
- Profile completeness check: guard or redirect logic that prompts users to complete their profile before generating workouts

**Dependencies:**

- **Phase 1** must be complete (database tables exist)

**Estimated Complexity:** M

- **Justification:** Standard CRUD form with Supabase integration. The IndexedDB caching layer and signal-based state add some complexity but follow established patterns.

**Risks & Mitigations:**

- **Risk:** Dexie version bump may require migration logic for existing IndexedDB data → **Mitigation:** Since the app is pre-launch with no real user data, a version bump with new stores is safe. Use Dexie's `version(N).stores()` upgrade path.
- **Risk:** Profile form validation must match the Zod schema exactly → **Mitigation:** Use the shared `UserProfileSchema` to drive Angular form validators programmatically or validate on submit.

**Validation Criteria:**

- User can create a profile, see it populated on revisit
- Profile persists to Supabase `user_profiles` table (verify in Studio)
- Profile loads from IndexedDB when offline (disable network in DevTools)
- Profile form validates all fields per schema constraints (age > 0, fitness_level 1-5, etc.)
- Navigation between profile and home works correctly

**Technical Notes:**

- Use Angular reactive signals for form state, not `FormGroup` (or use `FormGroup` with signal wrappers if more convenient - either is acceptable)
- Profile form fields: age (number), weight (number), weight unit (lbs/kg toggle or select), fitness level (1-5 slider or select), physical limitations (textarea, optional)
- On app init or auth state change, `UserProfileService` should attempt to load the profile from Supabase, falling back to IndexedDB cache
- The service should expose a `hasProfile` signal for guards/conditional UI
- The `UserProfileSchema` field names (`age`, `weight`, `weight_unit`, `fitness_level`, `physical_limitations`) now match both the DB columns and form field names directly — no mapping needed

### Phase 2 File Manifest

| Action | File Path                                                | Description                                |
| ------ | -------------------------------------------------------- | ------------------------------------------ |
| Create | `apps/web/src/app/core/services/user-profile.service.ts` | Profile CRUD, caching, signal state        |
| Create | `apps/web/src/app/features/profile/profile.component.ts` | Profile form (inline template/styles)      |
| Create | `apps/web/src/app/features/profile/profile.routes.ts`    | Profile routing                            |
| Modify | `apps/web/src/app/core/db/indexed-db.service.ts`         | Add userProfiles table, bump Dexie version |
| Modify | `apps/web/src/app/app.routes.ts`                         | Add profile route                          |
| Modify | `apps/web/src/app/features/home/home.component.ts`       | Add profile nav link                       |

---

## Phase 3: Revision API Endpoints

**Objective:** Implement two new Vercel Function endpoints that allow users to revise a generated workout or a specific exercise using natural language instructions.

**Key Deliverables:**

- `POST /api/workouts/revise` endpoint - accepts current workout + original input + revision text, returns revised `WorkoutGeneratorResult`
- `POST /api/workouts/revise-exercise` endpoint - accepts current exercise + workout context + original input + revision text, returns revised exercise
- New LangChain chains in `api/_chains/` for revision operations
- New YAML prompt templates in `api/_prompts/` for revision instructions
- Vitest tests for the new chains

**Dependencies:**

- **Phase 1** must be complete (shared revision schemas exist)

**Estimated Complexity:** L

- **Justification:** Two new endpoints, two new LangChain chains, new YAML prompts that must carefully instruct the AI to modify existing workout data while preserving structure. The exercise revision is particularly nuanced because it must maintain schema compliance for a single exercise within the larger workout context.

**Risks & Mitigations:**

- **Risk:** AI may not reliably preserve the workout structure when revising → **Mitigation:** Use `withStructuredOutput()` to enforce schema compliance. Include explicit instructions in prompts to preserve fields not mentioned in the revision.
- **Risk:** Exercise revision may produce an exercise that doesn't fit the overall workout (e.g., wrong muscle group) → **Mitigation:** Include the full workout context in the prompt so the AI understands the broader workout plan.
- **Risk:** Revision prompts may be difficult to get right on the first try → **Mitigation:** Start with simple prompts, test with varied revision instructions, iterate on prompt wording.

**Validation Criteria:**

- `POST /api/workouts/revise` returns a valid `WorkoutOutput` matching the original workout type
- `POST /api/workouts/revise-exercise` returns a valid `Exercise` object
- Revision respects the natural language instruction (e.g., "make it harder" increases weight/intensity)
- Invalid inputs return appropriate 400 errors
- Unauthenticated requests return 401
- Vitest tests pass for happy path and error cases

**Technical Notes:**

- Follow existing endpoint pattern: CORS preflight → method check → auth → chain → error handling
- Revision chain structure: System prompt (same fitness_trainer) + revision-specific user prompt that includes the current state and revision instruction
- For workout revision, the output schema should match the original workout type's output schema
- For exercise revision, use `ExerciseSchema` as the structured output schema
- The revision prompts should instruct the AI to: (1) understand the current state, (2) apply the revision, (3) preserve everything not mentioned in the revision
- The revision input includes `original_input` which contains the nested `user` profile — the chain's `toPromptInput()` pattern can be reused or extended for building revision prompt variables

### Phase 3 File Manifest

| Action | File Path                                 | Description                           |
| ------ | ----------------------------------------- | ------------------------------------- |
| Create | `api/workouts/revise.ts`                  | Workout revision endpoint handler     |
| Create | `api/workouts/revise-exercise.ts`         | Exercise revision endpoint handler    |
| Create | `api/_chains/workout-reviser.chain.ts`    | LangChain chain for workout revision  |
| Create | `api/_chains/exercise-reviser.chain.ts`   | LangChain chain for exercise revision |
| Create | `api/_prompts/revise_workout.prompt.yml`  | Workout revision prompt template      |
| Create | `api/_prompts/revise_exercise.prompt.yml` | Exercise revision prompt template     |
| Modify | `api/_chains/index.ts`                    | Export new chain functions            |

---

## Phase 4: New Workout Feature (Angular) - Generation Flow

**Objective:** Build the core "new workout" UI flow in the Angular app: a multi-step form that collects workout parameters, calls the generate API, and displays the generated workout.

**Key Deliverables:**

- `WorkoutService` in `core/services/` - orchestrates workout generation, revision, saving; manages current workout state as signals
- New workout feature module: `features/new-workout/` with components for the generation flow
- Multi-step form component: workout type selection → dynamic parameter form → generation → results display
- `ApiService` updates: add methods for revise and revise-exercise endpoints
- Route: `/workouts/new` added to `app.routes.ts`
- Navigation: "New Workout" button/link on home page

**Dependencies:**

- **Phase 2** must be complete (user profile exists and is loadable for populating workout input)
- **Phase 3** must be complete (revision endpoints exist for the revision UI in Phase 5)

**Estimated Complexity:** L

- **Justification:** The multi-step form with dynamic fields per workout type, API integration, loading/error states, and results display is the most UI-intensive phase. The workout results display must handle three distinct workout output shapes (hypertrophy/strength exercises, conditioning intervals).

**Risks & Mitigations:**

- **Risk:** Large inline templates for complex form steps → **Mitigation:** Break into sub-components (type selector, parameter form, results view) that are imported by the parent. Each sub-component uses inline template/styles per project convention.
- **Risk:** API call takes 10-30 seconds for AI generation → **Mitigation:** Show a clear loading state with progress indication. Consider a skeleton/shimmer UI for the results area.
- **Risk:** Form state management across steps is complex with signals → **Mitigation:** Use a `WorkoutFormState` signal in the service that tracks the current step, collected inputs, and generation status.

**Validation Criteria:**

- User can select a workout type and see appropriate fields
- Hypertrophy form shows: target_muscle_group, tempo_focus, weight_progression_pattern, equipment_access, equipment_notes, duration
- Strength form shows: target_muscle_group, load_percentage, weight_progression_pattern, equipment_access, equipment_notes, duration
- Conditioning form shows: interval_structure, cardio_modality, distance_time_goal, equipment_access, equipment_notes, duration
- User profile fields (age, weight, etc.) are auto-populated from the user's profile
- Form validates before submission
- API call succeeds and results display correctly for all three workout types
- Loading state displays during generation
- Error state displays if generation fails
- User can navigate back to modify parameters and regenerate

**Technical Notes:**

- The form should NOT ask users to re-enter profile fields — these are loaded from `UserProfileService` and nested as the `user` property in `WorkoutInput` before the API call
- The `UserProfile` type from the shared schema matches the `user` property shape exactly, so `WorkoutInput.user` can be assigned directly from the profile service signal
- Results display components:
  - Hypertrophy/Strength: List of exercises, each with sets table (reps, rest, weight)
  - Conditioning: List of intervals with timing, intensity, modality
  - Common: warmup list, cooldown list, general notes, difficulty rating, duration, conflicting parameters warning
- Consider a `WorkoutResultsComponent` that takes `WorkoutOutput` as input and uses `@switch` on `workout_type`

### Phase 4 File Manifest

| Action | File Path                                                                             | Description                                   |
| ------ | ------------------------------------------------------------------------------------- | --------------------------------------------- |
| Create | `apps/web/src/app/core/services/workout.service.ts`                                   | Workout state management, orchestration       |
| Create | `apps/web/src/app/features/new-workout/new-workout.component.ts`                      | Parent component, step orchestration          |
| Create | `apps/web/src/app/features/new-workout/new-workout.routes.ts`                         | Feature routing                               |
| Create | `apps/web/src/app/features/new-workout/components/workout-type-selector.component.ts` | Workout type selection step                   |
| Create | `apps/web/src/app/features/new-workout/components/workout-params-form.component.ts`   | Dynamic parameter form                        |
| Create | `apps/web/src/app/features/new-workout/components/workout-results.component.ts`       | Generated workout display                     |
| Create | `apps/web/src/app/features/new-workout/components/exercise-card.component.ts`         | Exercise display with sets                    |
| Create | `apps/web/src/app/features/new-workout/components/interval-card.component.ts`         | Conditioning interval display                 |
| Modify | `apps/web/src/app/core/services/api.service.ts`                                       | Add reviseWorkout(), reviseExercise() methods |
| Modify | `apps/web/src/app/app.routes.ts`                                                      | Add /workouts/new route                       |
| Modify | `apps/web/src/app/features/home/home.component.ts`                                    | Add "New Workout" navigation                  |

---

## Phase 5: Workout Editing & Revision UI

**Objective:** Add the ability to manually edit workout details and use AI-powered natural language revision for the entire workout or individual exercises. Add the "save workout" flow that persists the final result to Supabase.

**Key Deliverables:**

- Manual edit mode for workout results: inline editing of exercise names, set values (reps, weight, rest), interval values, warmup/cooldown text, notes
- AI revision UI: text input for natural language revision instructions at the workout level and per-exercise level
- Save workout flow: persist finalized workout to Supabase `workouts` table with offline IndexedDB fallback
- IndexedDB schema update: add `workouts` table for local caching
- Confirmation/success state after saving

**Dependencies:**

- **Phase 4** must be complete (generation flow and results display exist)
- **Phase 3** must be complete (revision API endpoints exist)

**Estimated Complexity:** XL

- **Justification:** This phase combines three significant features: manual inline editing (complex UI state), AI revision integration (API calls with loading states on individual exercises and the full workout), and the save-to-Supabase persistence flow with offline support. Each has its own state management and error handling needs.

**Risks & Mitigations:**

- **Risk:** Inline editing UI becomes complex with many editable fields → **Mitigation:** Use an edit/view mode toggle per card rather than making everything always editable. Click-to-edit pattern.
- **Risk:** AI revision may return unexpected results → **Mitigation:** Show a diff or preview before applying the revision. Allow the user to reject the revision and keep the current version. At minimum, show the revised result and let them accept or discard.
- **Risk:** Saving to Supabase while offline → **Mitigation:** Use the existing `IndexedDbService.addToSyncQueue()` pattern. Save to IndexedDB immediately, queue sync operation, sync when online.
- **Risk:** User loses generated workout if they navigate away → **Mitigation:** Store the current workout state in `WorkoutService` signal. Consider a "discard workout?" confirmation if navigating away with unsaved changes.

**Validation Criteria:**

- User can toggle edit mode on exercise cards and modify reps, weight, rest, exercise name, notes
- User can toggle edit mode on interval cards and modify duration, rest, intensity, modality, notes
- User can edit warmup and cooldown items
- User can enter revision text at the workout level and receive a revised workout from the API
- User can enter revision text per exercise and receive a revised exercise from the API
- Revised content replaces current content (with option to accept/discard)
- Loading states display during revision API calls
- User can save the finalized workout to Supabase
- Saved workout appears in `workouts` table with correct user_id, workout_type, data, and input
- Save works offline (queued for sync)
- Success feedback after saving

**Technical Notes:**

- Edit mode state should be per-component, not global (e.g., each `ExerciseCardComponent` tracks its own `isEditing` signal)
- For AI revision, the UI should show a text input that expands when clicked, with a "Revise" button
- The revision request needs the original input (stored in `WorkoutService` state) and current workout state
- Save flow: `WorkoutService.saveWorkout()` → write to Supabase → on success, navigate to home or workout detail; on failure (offline), save to IndexedDB + sync queue
- The `workouts` table in IndexedDB should store the full workout + metadata for offline access

### Phase 5 File Manifest

| Action | File Path                                                                       | Description                                        |
| ------ | ------------------------------------------------------------------------------- | -------------------------------------------------- |
| Modify | `apps/web/src/app/features/new-workout/components/exercise-card.component.ts`   | Add edit mode, inline editing                      |
| Modify | `apps/web/src/app/features/new-workout/components/interval-card.component.ts`   | Add edit mode, inline editing                      |
| Modify | `apps/web/src/app/features/new-workout/components/workout-results.component.ts` | Add revision UI, edit warmup/cooldown, save button |
| Create | `apps/web/src/app/features/new-workout/components/revision-input.component.ts`  | Reusable revision text input with submit           |
| Modify | `apps/web/src/app/core/services/workout.service.ts`                             | Add revision and save methods                      |
| Modify | `apps/web/src/app/core/db/indexed-db.service.ts`                                | Add workouts table, bump Dexie version             |

---

## Final Recommendations

### Critical Path

```
Pre-Phase (Completed): UserProfile schema refactor
         │
Phase 1 (DB + Schemas)
├── Phase 2 (User Profile Angular) ──────┐
└── Phase 3 (Revision API Endpoints) ────┤
                                         ├── Phase 4 (Generation Flow Angular)
                                         │         │
                                         │         ▼
                                         └── Phase 5 (Editing, Revision UI, Save)
```

- **Phases 2 and 3 can run in parallel** after Phase 1 completes (no dependencies between them)
- **Phase 4 depends on both Phases 2 and 3** (needs profile data and revision API)
- **Phase 5 depends on Phase 4** (extends the results UI)

### Technical Risks

1. **AI revision quality** - The revision endpoints depend on prompt engineering to produce coherent modifications. Poor prompts will result in a bad user experience.
   - _Mitigation:_ Invest in prompt iteration during Phase 3. Test with diverse revision instructions. Use structured output to enforce schema compliance.

2. **Offline sync complexity** - The sync queue pattern works for simple CRUD but may need conflict resolution for workouts edited on multiple devices.
   - _Mitigation:_ Use last-write-wins for the initial implementation. The `updated_at` column enables future conflict detection.

3. **Bundle size** - Adding a multi-step form, workout display components, and revision UI could push the bundle toward the 500kB warning.
   - _Mitigation:_ All new feature components are lazy-loaded via route-level code splitting. The shared Zod schemas are already in the bundle via `@trkn-shared`.

4. **API latency for generation/revision** - AI generation takes 10-30 seconds. Users may abandon the flow.
   - _Mitigation:_ Clear loading states, consider streaming responses in a future iteration. The current `maxDuration: 30` in vercel.json is adequate.

5. **Form complexity with three workout types** - The dynamic form must correctly show/hide fields and validate per type.
   - _Mitigation:_ Use Angular's `@switch` control flow to render type-specific form sections. Validate against the discriminated union schema on submit.

### Architecture Decisions

1. **Workout data storage**: Use `jsonb` column for the full workout output rather than normalized tables. This matches the AI generation pattern where the entire workout is produced as a unit.

2. **Profile field naming**: `UserProfileSchema` uses clean names (`age`, `weight`) that match DB columns directly. The `toPromptInput()` mapping in the LangChain chain translates to prompt variable names (`user_age`, `user_weight`) at the API boundary only.

3. **Nested user profile in WorkoutInput**: `BaseWorkoutInputSchema` nests the profile as a `user` property rather than flat-merging. This cleanly separates user data from workout parameters and makes the API payload self-documenting.

4. **Revision endpoint design**: Two separate endpoints (revise-workout, revise-exercise) rather than one generic endpoint. This allows tailored prompts and structured output schemas for each use case.

5. **State management**: Use `WorkoutService` with signals for the generation flow state (current step, inputs, generated workout, edit state). No need for a state management library.

### Prerequisites

Before starting Phase 1:

- Docker Desktop running (for local Supabase)
- Local Supabase instance started (`supabase start`)
- `.env.local` configured with Supabase credentials
- `ANTHROPIC_API_KEY` set for Vercel Functions development
- All existing builds passing (`pnpm build:web`, `pnpm build:vercel`)
