# UI Components Phase 1: Wrapper Architecture Spike and API Mapping

This document is the implementation output for Phase 1 of `docs/implementations/ui-components.md`.

## Phase 1 Objective

Lock the wrapper architecture before coding to avoid rework across the UI primitives listed in issue `#15`.

## Pre-Implementation Assessment

### Codebase Findings

- `apps/web` currently has no `shared/components/ui/` directory.
- `apps/web` currently has no Angular Primitives dependency installed.
- The `new-workout` feature contains dense ad-hoc Tailwind usage and is the best proof-of-concept migration target.
- Root bootstrap is minimal (`apps/web/src/app/app.ts`) and currently renders only `<router-outlet />`, which is a good place for global UI hosts (e.g., toast viewport).
- Layouts are centralized in `apps/web/src/app/layout-default.ts` and `apps/web/src/app/layout-minimal.ts`, both composing `app-layout`.

### Questions Needing Clarification

- None blocking for Phase 1 execution.

### Technical Concerns

- **Concern:** Issue `#15` references `HlmButtonDirective` while the requested foundation is Angular Primitives.
  **Why This Matters:** `Hlm*` naming is commonly associated with Spartan/Helm wrappers and can cause API drift or accidental dependency choices.
  **Recommendation:** Use a local `Ui*` naming convention for wrappers and treat Angular Primitives as the only headless dependency in scope.

- **Concern:** Angular Primitives docs currently indicate there is no table primitive.
  **Why This Matters:** The issue scope lists `Table` as an Angular Primitives primitive, which is inaccurate and affects implementation sequencing.
  **Recommendation:** Implement a local semantic table wrapper (Tailwind-styled Angular standalone components/directives) in the UI layer, but not as an Angular Primitives-backed wrapper.

## Phase 1 Decisions (Locked for Phase 2)

### 1. Naming and Export Conventions

Decision:
- Use local `Ui*` names for all wrappers (`UiButtonDirective`, `UiInputDirective`, `UiSelectComponent`, etc.).
- Re-export Angular Primitives symbols from wrapper files only when needed by consumers.
- Export all wrappers from `apps/web/src/app/shared/components/ui/index.ts`.

Rationale:
- Avoids `Hlm*`/Spartan naming confusion.
- Makes the local design-system API explicit and stable even if underlying primitives change.

### 2. Wrapper Shape by Primitive Type

Decision:
- Use directive wrappers for native-like controls where possible (`button`, `input`, `textarea`, `separator` if applicable).
- Use component wrappers for composite/overlay primitives (`select`, `dialog`, `accordion`, `toast`, `progress`).
- Use composable wrapper components/directives for form-field building blocks (`field`, `label`, `description`, `message`) rather than one monolithic field abstraction.

Rationale:
- Preserves Angular forms ergonomics on native elements.
- Keeps complex primitives manageable and consistent across the app.
- Avoids over-abstracting validation logic.

### 3. Styling Strategy (Phase 2 Baseline)

Decision:
- Start with plain Tailwind class constants in wrapper files (no `class-variance-authority` and no `tailwind-merge` in Phase 2).
- Support local extension via `[class]`/class passthrough where Angular Primitives/native elements allow it.
- Revisit a `cn()`/variant utility only after at least `button`, `input`, and `select` wrappers are implemented and pain is observed.

Rationale:
- Matches current codebase simplicity and issue scope.
- Avoids adding styling utility dependencies before the wrapper API stabilizes.

### 4. Form Integration Contracts

Decision:
- `UiInputDirective` and `UiTextareaDirective` remain native-control wrappers and work directly with Reactive Forms/`ngModel`.
- `UiCheckbox` and `UiSwitch` wrappers must support Angular forms usage in Phase 2 (either native-compatible directive usage or a CVA-backed wrapper if primitives require composite structure).
- `UiSelectComponent` is expected to be a CVA-backed wrapper if Angular Primitives select composition is non-native.
- `UiFormField*` wrappers will handle layout/semantics only (label, hint, error message structure) and will not own validation logic.

Rationale:
- Keeps form state ownership in Angular forms.
- Prevents hidden coupling between UI wrappers and form implementation details.

### 5. Overlay and Notification Integration

Decision:
- `Toast` global host/viewport will be mounted at the app root (`apps/web/src/app/app.ts`) so it is available across both default and minimal layouts.
- Any toast provider/config required by Angular Primitives will be added in `apps/web/src/app/app.config.ts`.
- `Dialog` will be implemented as local wrappers used by feature components; no separate global dialog host is planned in Phase 2 unless docs require it.

Rationale:
- `App` is the only guaranteed shared shell across layouts.
- Keeps overlay infrastructure centralized and avoids per-layout duplication.

## Primitive-to-Package/API Mapping (Phase 1 Output)

Notes:
- Import examples below are based on Angular Primitives docs examples.
- Composite primitives likely require additional exported symbols beyond the root symbol shown in docs examples; those will be finalized in Phase 2 scaffolding.

| Primitive | Angular Primitives availability | Doc example import path | Doc example symbol | Local wrapper plan | Phase 2 notes |
| --- | --- | --- | --- | --- | --- |
| Button | Yes | `ng-primitives/button` | `NgpButton` | `UiButtonDirective` | Directive wrapper on native `button` |
| Input | Yes | `ng-primitives/input` | `NgpInput` | `UiInputDirective` | Directive wrapper on native `input` |
| Textarea | Yes | `ng-primitives/textarea` | `NgpTextarea` | `UiTextareaDirective` | Directive wrapper on native `textarea` |
| Checkbox | Yes | `ng-primitives/checkbox` | `NgpCheckbox` | `UiCheckboxComponent` or directive set | Final shape depends on primitive composition requirements |
| Select | Yes | `ng-primitives/select` | `NgpSelect` | `UiSelectComponent` (+ subparts) | Plan for CVA if non-native |
| Form Field | Yes | `ng-primitives/form-field` | `NgpFormField` | `UiFormField*` wrappers | Composable wrappers only |
| Dialog | Yes | `ng-primitives/dialog` | `NgpDialog` | `UiDialog*` wrappers | Verify portal/overlay composition exports |
| Accordion | Yes | `ng-primitives/accordion` | `NgpAccordion` | `UiAccordion*` wrappers | Multi-part wrapper set |
| Table | No (docs note no primitive) | N/A | N/A | Local semantic table wrappers (Tailwind only) | Not Angular Primitives-backed |
| Progress | Yes | `ng-primitives/progress` | `NgpProgress` | `UiProgressComponent` | May need indicator subpart export |
| Toast | Yes | `ng-primitives/toast` | `NgpToast` | `UiToast*` wrappers + viewport host | Verify config/provider requirements |
| Separator | Yes | `ng-primitives/separator` | `NgpSeparator` | `UiSeparatorDirective` or component | Thin wrapper |
| Switch | Yes | `ng-primitives/switch` | `NgpSwitch` | `UiSwitchComponent` | Validate Angular forms integration |

## Confirmed Dependency and Package Decisions

### Direct Dependencies to Install in Phase 2

- `ng-primitives` (single package with subpath imports like `ng-primitives/button`)

Recommended command:

```bash
pnpm add:web ng-primitives
```

### Dependencies Explicitly Deferred (Phase 2 baseline = no)

- `class-variance-authority`
- `tailwind-merge`
- `clsx`

Reason:
- Phase 2 should establish wrappers first with plain Tailwind classes. Add variant utilities only if duplication becomes a demonstrated problem.

### Compatibility Check to Perform in Phase 2

- Confirm Angular 21 build compatibility after installation via `pnpm build:web`
- Confirm any peer dependency warnings from `pnpm add:web ng-primitives`

## Repo Usage Inventory and POC Mapping (New Workout)

This maps current UI usage in `new-workout` to wrapper priorities so Phase 2+ implementation can validate APIs against real markup.

### Directly Present in `new-workout`

- `Button`: widely used in `workout-type-selector`, `workout-params-form`, `workout-results`, `revision-input`, `exercise-card`, `interval-card`
- `Input`: numeric/text inputs in `workout-params-form`, `exercise-card`, `interval-card`
- `Textarea`: `workout-params-form`, `revision-input`, `exercise-card`, `interval-card`
- `Checkbox`: `tempo_focus` toggle in `workout-params-form`
- `Select`: multiple parameter selects in `workout-params-form`; edit selects in `interval-card`
- `Table`: exercise sets table in `exercise-card`
- `Separator` (conceptual): repeated `border-t` section dividers in `exercise-card` and `interval-card`
- `Progress` (conceptual): custom multi-step progress indicator in `new-workout.component.ts`

### Strong Conceptual Migration Targets (Not Yet Primitive-Based)

- `Accordion`: `revision-input` currently implements an expand/collapse panel with local signal state
- `Dialog`: inline edit modes in `exercise-card` and `interval-card` are good candidates for future overlay editing patterns
- `Toast`: success/error banners in `workout-results` and form error displays can evolve into a centralized toast pattern
- `Switch`: no obvious current usage in `new-workout`; wrapper can be implemented for broader app usage and future toggles
- `Form Field`: current label + control + validation text patterns are repeated throughout `workout-params-form`

## Phase 2 File and Implementation Plan (Actionable)

### Files to Create (Phase 2)

- `apps/web/src/app/shared/components/ui/index.ts`
- `apps/web/src/app/shared/components/ui/README.md` (optional but recommended to document wrapper usage conventions)
- Wrapper directories/files per primitive (final file list depends on primitive composition exports)

### Files to Modify (Phase 2)

- `apps/web/src/app/shared/components/index.ts` (only if re-exporting `ui` barrel from the higher-level shared components barrel)
- `apps/web/src/app/app.ts` (toast viewport host, if included in Phase 2 scaffolding)
- `apps/web/src/app/app.config.ts` (toast/global primitive provider config, if required)

### Implementation Order (Phase 2+)

1. Install `ng-primitives` and verify build
2. Create `ui/` folder + barrel + shared wrapper conventions
3. Implement thin wrappers: button/input/textarea/separator
4. Implement form wrappers: checkbox/switch/select/form-field
5. Implement structural/overlay wrappers: accordion/dialog/progress/toast
6. Implement local table wrapper set (Tailwind only)
7. Migrate `new-workout` proof-of-concept components incrementally

## Validation Performed for Phase 1

- Reviewed current repo structure and `new-workout` usage patterns
- Verified Angular Primitives import examples for targeted primitives in official docs
- Verified Angular Primitives docs note that `table` has no primitive
- Verified app root/layout integration points for future `toast` host placement

## Output for Next Phase

Phase 1 provides:
- Locked wrapper naming and API direction (`Ui*`)
- Confirmed base dependency choice (`ng-primitives`)
- Primitive mapping with one explicit scope correction (`table`)
- Forms and overlay integration decisions tied to actual repo files
- A repo-specific migration inventory for `new-workout`
