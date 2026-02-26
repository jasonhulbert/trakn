# UI Components Implementation Plan

## Project Details Summary

**Overview:** Build a reusable UI wrapper layer for Angular Primitives in `apps/web`, with Tailwind styling, and migrate at least one existing feature component (preferably `new-workout`) as proof of concept.

**Requirements:**
- Create wrappers for the listed primitives (button, input, textarea, checkbox, select, form field, dialog, accordion, table, progress, toast, separator, switch)
- Place wrappers in `apps/web/src/app/shared/components/ui/`
- Use standalone Angular components/directives
- Export via `shared/components/ui/index.ts`
- Preserve existing functionality and design conventions
- Compatible with Angular 21+ zoneless + signals

**Technology Stack:** Angular 21 (standalone, zoneless, signals), Tailwind CSS v4, PNPM workspace, Angular Primitives (to be added)

**Current State (repo inspection):**
- No `shared/components/ui/` directory exists yet
- `apps/web` has no Angular Primitives dependencies installed
- `new-workout` feature currently uses ad-hoc Tailwind classes extensively and is a strong POC target
- Minimal shared component library currently (`icon`, `navbar`, layout)

**Constraints:**
- Preserve existing visual language while codifying it in wrappers
- Keep wrappers standalone and compatible with current Angular patterns
- Avoid regressions in `new-workout` flow and editing/revision interactions

**Additional Context:** Issue `#15` is scoped to primitives already in use, not a full design-system rollout.

**Source:** GitHub issue `jasonhulbert/trakn#15` + local repo/`AGENTS.md` inspection

## Issue Summary

- **Title:** `feat(ui): implement Angular Primitives component wrappers with Tailwind CSS`
- **Number:** `15`
- **Repository:** `jasonhulbert/trakn`
- **Labels:** `enhancement`
- **Status:** `Open`

## Key Takeaways From Issue

- This is a headless-primitive integration with custom styling ownership in Tailwind
- Scope is intentionally limited to primitives already used in `trkn-web`
- Acceptance criteria explicitly require a barrel export and a proof-of-concept migration
- No issue comments or linked PRs yet

## Information Gaps

- No blocking gaps for planning
- Implementation-level decisions still needed (naming convention, toast/dialog provider pattern, styling utility approach)

## Clarifying Questions

- None required to produce a plan, but clarify the `HlmButtonDirective` naming reference (Spartan/Helm naming) before implementation to avoid API/naming drift

## Technical Concerns

- **Concern:** Issue references `HlmButtonDirective` while describing Angular Primitives wrappers.  
  **Impact:** Can cause confusion between adopting Spartan/Helm components vs building custom wrappers on Angular Primitives.  
  **Recommendation:** Standardize on a local `Ui*` naming scheme and explicitly document whether Spartan is in or out of scope.

- **Concern:** `Toast` and `Dialog` require global/provider/viewport decisions not mentioned in acceptance criteria.  
  **Impact:** Risk of wrappers existing but not being usable/app-integrated.  
  **Recommendation:** Include provider/viewport integration as part of wrapper completion criteria.

- **Concern:** `Select` and `Form Field` wrappers need a clear Reactive Forms integration strategy.  
  **Impact:** POC migration may stall if wrapper API is not form-friendly.  
  **Recommendation:** Define wrapper contracts (native binding vs CVA-based component wrappers) in Phase 1.

## Implementation Plan

### Phase 1: Wrapper Architecture Spike and API Mapping

**Objective:** Lock the wrapper architecture before coding to avoid rework across 13 primitives.

**Key Deliverables:**
- Primitive-to-package/API mapping for Angular Primitives packages actually needed
- Wrapper naming conventions (`UiButtonDirective`, `UiSelectComponent`, etc.)
- Styling strategy decision (plain class constants vs `cva`/`tailwind-merge`)
- Form integration approach for `Select`, `Checkbox`, `Switch`, and `Form Field`
- Overlay/notification integration approach for `Dialog` and `Toast`

**Dependencies:**
- GitHub issue scope (`#15`) and current repo structure review
- None code-wise

**Estimated Complexity:** `M`  
**Justification:** Mostly design/decision work, but mistakes here create broad downstream churn.

**Risks & Mitigations:**
- **Risk:** Wrapper APIs diverge per primitive and feel inconsistent  
  **Mitigation:** Define a small wrapper API guideline doc before implementation
- **Risk:** Overengineering a design system beyond issue scope  
  **Mitigation:** Limit decisions to primitives listed in issue + POC needs

**Validation Criteria:**
- Written implementation notes/checklist for each primitive
- Confirmed list of npm packages to install
- Clear decision on `Ui*` naming and export conventions

**Research/Spike Work:**
- Verify current Angular Primitives package names/APIs
- Confirm toast/dialog requirements (provider, viewport, portal usage)
- Test one representative wrapper (button/select) in isolation if needed

**Technical Notes:**
- Prefer consistent thin-wrapper plus styling patterns where possible
- Separate primitive wrapper from app-specific composite controls

**Related to Issue:** "Implementation Notes", "Components to implement", acceptance criteria on standalone wrappers and consistent styling

### Phase 2: UI Foundation Setup (Dependencies, Structure, Shared Utilities)

**Objective:** Create the shared UI wrapper foundation so primitives can be added consistently.

**Key Deliverables:**
- Install Angular Primitives dependencies in `apps/web`
- Create `apps/web/src/app/shared/components/ui/` structure
- Add `shared/components/ui/index.ts` barrel export
- Add shared class utility (if chosen) and common style tokens/helpers
- Add any global host/viewport plumbing needed for `Toast` and `Dialog` (or placeholder integration)

**Dependencies:**
- Phase 1 decisions finalized
- Access to exact Angular Primitives package names/APIs

**Estimated Complexity:** `M`  
**Justification:** Mostly setup/scaffolding, but touches dependency graph and shared imports.

**Risks & Mitigations:**
- **Risk:** Package/version mismatch with Angular 21  
  **Mitigation:** Pin compatible versions and verify with `pnpm build:web`
- **Risk:** Barrel export cycles or inconsistent file layout  
  **Mitigation:** Use one-folder-per-primitive with explicit exports

**Validation Criteria:**
- `pnpm install` succeeds
- `pnpm build:web` compiles with new dependencies and scaffolding
- Barrel exports resolve without import errors

**Research/Spike Work:**
- Decide whether to centralize Tailwind class variants now or defer
- Decide whether CSS variables/theme tokens are needed in this issue or a follow-up

**Technical Notes:**
- Keep wrappers standalone by default
- Align file names with existing repo conventions (inline templates/styles)
- Avoid introducing a heavy theming dependency unless justified

**Related to Issue:** Wrapper location, barrel export acceptance criterion

### Phase 3: Core Input and Action Wrappers (High-Usage Primitives)

**Objective:** Implement wrappers for the simplest/highest-frequency controls to enable early migrations.

**Key Deliverables:**
- `Button`
- `Input`
- `Textarea`
- `Checkbox`
- `Switch`
- `Separator`
- `Progress` (if simple wrapper pattern)
- Tests/smoke examples for representative wrappers (button + input + checkbox)

**Dependencies:**
- Phase 2 UI foundation in place
- Phase 1 styling and naming conventions

**Estimated Complexity:** `L`  
**Justification:** High count and wide usage surface; must preserve native behavior, focus, disabled states, and form bindings.

**Risks & Mitigations:**
- **Risk:** Styling regressions from replacing ad-hoc classes  
  **Mitigation:** Match current Tailwind patterns first, refine later
- **Risk:** Inconsistent disabled/focus/invalid states across wrappers  
  **Mitigation:** Define shared state classes and state matrix checklist

**Validation Criteria:**
- Wrappers render and behave correctly in Angular templates
- Keyboard/focus states verified manually
- `pnpm build:web` and `pnpm lint:all` pass
- No runtime errors in `new-workout` when importing wrappers (even before full migration)

**Research/Spike Work:**
- Confirm whether `Progress` wrapper should be primitive-only or include app-facing API sugar
- Confirm best Angular pattern for directive-style button wrapper vs component wrapper

**Technical Notes:**
- Prefer preserving native form controls where possible to minimize CVA complexity
- Build wrappers to accept `class` extension hooks for local overrides

**Related to Issue:** Button/Input/Textarea/Checkbox/Switch/Separator/Progress rows in component list

### Phase 4: Form Composition Wrappers (Select + Form Field)

**Objective:** Implement the highest-risk form primitives needed to replace `new-workout` parameter forms cleanly.

**Key Deliverables:**
- `Select` wrapper with Angular forms-friendly API
- `Form Field` wrapper(s): label/control/message/hint composition
- Validation/error display integration patterns
- Example usage replacing a few fields in `workout-params-form`

**Dependencies:**
- Phases 1-3 completed (especially input styling conventions)
- Reactive Forms integration strategy agreed

**Estimated Complexity:** `L`  
**Justification:** `Select` and field composition are the most likely sources of API friction and regressions.

**Risks & Mitigations:**
- **Risk:** Wrapper API is awkward with Reactive Forms  
  **Mitigation:** Validate with real `FormGroup` usage in `workout-params-form` during implementation
- **Risk:** Validation message semantics/accessibility regressions  
  **Mitigation:** Explicitly test label association, `aria-*`, error states

**Validation Criteria:**
- `workout-params-form` can migrate at least a representative subset (input/select/checkbox + validation messages)
- Form values and validation states still behave correctly
- Keyboard navigation works for select

**Research/Spike Work:**
- Confirm whether custom select needs `ControlValueAccessor` or direct primitive binding is enough
- Verify a11y behavior for label/message associations with Angular Primitives form field primitives

**Technical Notes:**
- Form Field wrappers should compose, not hide, Angular form state
- Avoid baking `FormControl` assumptions too deeply into base wrappers

**Related to Issue:** `Select`, `Form Field`, and proof-of-concept acceptance criterion

### Phase 5: Structured, Disclosure, and Overlay Feedback Wrappers

**Objective:** Finish the remaining primitives used in the `new-workout` result/edit flows and global feedback patterns.

**Key Deliverables:**
- `Dialog`
- `Accordion`
- `Table`
- `Toast` (including viewport/provider integration)
- Finalize `Progress` here if deferred from Phase 3

**Dependencies:**
- Phase 2 foundation
- Phase 1 overlay/provider decisions
- Phase 3/4 styling conventions

**Estimated Complexity:** `XL`  
**Justification:** Overlay/disclosure primitives require state, focus management, and app-level integration; `Toast` adds global infrastructure.

**Risks & Mitigations:**
- **Risk:** Dialog/toast wrappers implemented but not wired into app shell  
  **Mitigation:** Include app integration tasks explicitly (viewport/provider placement)
- **Risk:** Table wrapper becomes too opinionated for current exercise set table  
  **Mitigation:** Start with thin semantic table wrappers, no data-table abstraction
- **Risk:** Accordion/Dialog state clashes with existing inline-edit logic  
  **Mitigation:** Migrate one interaction path at a time and test edit/save/cancel flows

**Validation Criteria:**
- Dialog open/close/focus trap behavior verified manually
- Toast can render success/error/info notifications in app context
- Table wrapper reproduces current exercise sets table styling/semantics
- `pnpm build:web` and smoke navigation through `new-workout` results/edit screens work

**Research/Spike Work:**
- Confirm toast host placement in Angular app root/layout
- Verify dialog/accordion APIs with zoneless Angular + signals interactions

**Technical Notes:**
- Keep table wrappers semantic (`table`, `thead`, `tbody`, etc.) with styling directives/components
- Treat toast as infrastructure + primitive wrappers, not just presentational classes

**Related to Issue:** `Dialog`, `Accordion`, `Table`, `Toast`, `Progress` rows and no-regression acceptance criterion

### Phase 6: Proof-of-Concept Migration, Regression Hardening, and Documentation

**Objective:** Migrate the `new-workout` feature to use the new wrappers, prove viability, and stabilize.

**Key Deliverables:**
- Migrate at least one feature component (recommended: multiple components in `new-workout` to exercise wrappers)
- Update imports to use `shared/components/ui/index.ts`
- Regression checks for generation/revision/save flows
- Usage notes/examples for wrapper APIs (short internal docs or code comments)
- Final issue checklist mapping to acceptance criteria

**Dependencies:**
- Phases 3-5 wrapper implementation complete for migrated controls
- `new-workout` component selection for POC confirmed

**Estimated Complexity:** `L`  
**Justification:** Real migration surfaces edge cases not visible in isolated wrapper development.

**Risks & Mitigations:**
- **Risk:** POC only touches trivial controls and misses high-risk wrappers  
  **Mitigation:** Choose `new-workout` components that cover `Select`, `Form Field`, `Table`, `Accordion`/`Dialog`, `Textarea`, `Button`
- **Risk:** Visual drift from current UI during migration  
  **Mitigation:** Snapshot/manual before/after checks on key screens

**Validation Criteria:**
- Acceptance criteria checklist all satisfied
- `pnpm build:web` passes
- `pnpm lint:all` passes
- `pnpm test:web` passes (or documented gaps if existing coverage is absent)
- Manual QA: keyboard tab flow, focus visibility, validation messages, dialog/toast behavior, mobile layout sanity

**Research/Spike Work:**
- None expected beyond bugfix-level adjustments discovered during migration

**Technical Notes:**
- Migrate feature code incrementally to reduce diff size
- Preserve existing signals/zoneless patterns; wrappers should not introduce Zone assumptions

**Related to Issue:** Proof-of-concept migration, barrel export, consistent styling, no regressions

## Final Recommendations

### Critical Path

- Sequential: Phase 1 -> Phase 2 -> Phase 4 (for form POC viability) -> Phase 6
- Can be partially parallelized after Phase 2:
- Phase 3 (core wrappers)
- Phase 5 (overlay/structural wrappers), if overlay decisions are already finalized in Phase 1

### Technical Risks (Top Project-Level)

- Angular Primitives API/version mismatch with Angular 21  
  Mitigation: Confirm versions in Phase 1 and validate immediately in Phase 2 with build
- Form wrapper API friction (`Select`/`Form Field`) with Reactive Forms  
  Mitigation: Prototype against `workout-params-form` early (Phase 4), not in isolation only
- Overlay infrastructure under-specified (`Toast`, `Dialog`)  
  Mitigation: Treat provider/viewport integration as in-scope deliverables, not optional
- Inconsistent styling across wrappers  
  Mitigation: Define state class patterns and reuse strategy before bulk implementation
- POC migration too narrow to expose defects  
  Mitigation: Use `new-workout` components that exercise multiple primitive categories

### Architecture Decisions Needed

- Naming convention: local `Ui*` vs `Hlm*` naming
- Wrapper shape: directive-based (native-first) vs component-based wrappers per primitive
- Styling composition: raw Tailwind class strings vs utility (`cva`/`tailwind-merge`)
- Toast/dialog app integration location (root component vs shared layout)
- POC scope: single component minimum vs broader `new-workout` flow slice

### Alternative Approaches

- Thin wrappers only (recommended for this issue)  
  Pros: fast, low lock-in, aligns with issue scope  
  Cons: less immediate design-system abstraction
- Adopt a prebuilt styled layer (e.g., Spartan/Helm patterns)  
  Pros: faster initial UI coverage  
  Cons: conflicts with issue goal of owning design system styling; naming/API confusion
- Continue ad-hoc Tailwind without wrappers  
  Pros: no setup cost  
  Cons: fails issue goals, inconsistent styling persists, harder future migrations

### Prerequisites

- Confirm Angular Primitives package selection/version compatibility
- Confirm naming convention and wrapper API guidelines
- Decide whether toast/dialog provider wiring is included in this issue (recommended: yes)

### GitHub Issue Updates (Recommended)

1. Clarify whether `HlmButtonDirective` is a naming reference only or whether Spartan/Helm is intended.
2. Add a short "Definition of done" for `Toast` and `Dialog` (including provider/viewport/root wiring).
3. Specify the proof-of-concept target components in `new-workout` (e.g., `workout-params-form`, `exercise-card`, `revision-input`).
4. Add labels such as `frontend`, `angular`, `design-system`, `accessibility`.
5. Consider splitting into sub-issues if desired:
   - UI foundation/setup
   - Core form/action wrappers
   - Overlay/feedback wrappers
   - `new-workout` migration POC
