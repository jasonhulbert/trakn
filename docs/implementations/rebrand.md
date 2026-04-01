# Plan: UI Redesign — Stark Aesthetic

**Status:** All 6 phases complete
**Created:** 2026-03-30
**Updated:** 2026-03-31 (post-Phase 2 reflection)
**Phases:** 6

---

## Overview

Complete replacement of the Trakn app's visual aesthetic. The current system uses a four-color palette tied to workout types (cyan/violet/rose/orange) on a light background. The new direction is stark and minimal: an almost-black background, linen-white foreground, and sparing pops of brand orange — with simple geometric patterns as the primary visual language.

### Design Pillars

| Pillar | Description |
|--------|-------------|
| **Background** | Almost-black (`#111110`) |
| **Foreground** | Linen-white (`#F5F0E4`) |
| **Accent** | Brand orange (`#FF9500`) — used sparingly |
| **Danger** | Warm red — retained for destructive actions only |
| **Typography** | Plus Jakarta Sans — retained, same font |
| **Geometric patterns** | Per-workout-type patterns (decorative BG, hero elements, dividers) |

### Key Decisions

- Workout types differentiated by **geometric pattern** (not color)
- Component color variants **simplified to: default, accent, danger**
- Style guide will be **rewritten** to document the new system
- Geometric patterns used as: decorative backgrounds, hero/splash elements, dividers & borders

---

## Phase 1: Design Token System ✅

**Status:** Complete (2026-03-30)

**Objective:** Replace the current multi-color Tailwind theme (`@theme` block in `styles.css`) with the new stark aesthetic token set. This is the foundation all other phases build on.

**Key Deliverables:**

- New color tokens in `apps/web/src/styles.css` `@theme` block:
  - `--color-base-*`: Almost-black scale (900–950 dark, 50 near-white)
  - `--color-fore-*`: Linen-white scale (for foreground text and surfaces)
  - `--color-accent-*`: Brand orange scale — retained from existing primary, trimmed to fewer shades
  - `--color-danger-*`: Warm red — retained from existing danger, trimmed to fewer shades
  - Remove: all cyan, violet, rose, success, warning, info, and surface color scales
- Typography tokens retained (Plus Jakarta Sans)
- Border radius tokens retained (geometric aesthetic benefits from sharp/consistent radii)
- New semantic utility tokens for common patterns:
  - `--color-bg`: maps to darkest base tone
  - `--color-fg`: maps to linen-white
  - `--color-border`: subtle light border on dark bg (e.g. `oklch` / low opacity white)
- Update `apps/web/src/app/shared/components/ui/_internal/styles.ts`:
  - Replace all `surface-*`, `white`, multi-color references with new token names
  - Replace light-mode assumptions (`bg-white`, `border-surface-300`) with dark-mode tokens

**Dependencies:** None — this is the starting phase.

**Estimated Complexity:** M

- **Justification:** The token replacement is straightforward but requires careful mapping of every removed color to ensure downstream consumers don't silently break. Tailwind v4's `@theme` approach is clean but all class usages of removed colors will produce invisible failures (no build error, just missing styles).

**Agent Strategy:**

- **Pre-implementation exploration:** Explore agent should grep for every Tailwind color class currently in use across `apps/web/src/` — catalog all `bg-cyan-*`, `text-violet-*`, `border-rose-*`, `bg-surface-*`, `bg-white`, `text-surface-*` occurrences and which files contain them. This drives the safe removal of old tokens.
- **Parallel sub-tasks:** None — token definition must precede all other changes.
- **Isolation needs:** None required.
- **Verification steps:** After writing new tokens, run `pnpm build:web` to confirm no build errors. Visually audit the app in dev server (colors will be broken in many places — that is expected and is the input for later phases).

**Risks & Mitigations:**

- **Risk:** Removing color scales breaks Tailwind class usage silently (no compile error, just missing styles).
  **Mitigation:** Pre-implementation grep to catalog all usages before removal. Later phases fix each affected file.
- **Risk:** oklch/hsl color definitions may not match the desired almost-black/linen-white feel.
  **Mitigation:** Define exact hex values (`#111110` for base, `#F5F0E4` for fore) and verify against reference images before finalizing.

**Validation Criteria:**

- `pnpm build:web` completes without errors
- `apps/web/src/styles.css` contains no references to removed color names (cyan, violet, rose, success, warning, info, surface)
- New token set is complete and self-consistent (no dangling references)
- Dev server renders the app (even if visually broken on colors — that is expected)

**Technical Notes:**

- Tailwind v4 uses `@theme` with CSS custom properties, not a JS config file. Token names like `--color-accent-500` automatically generate `bg-accent-500`, `text-accent-500`, `border-accent-500` utility classes.
- Keep the existing `--radius-*` scale — the stark aesthetic benefits from consistent, defined border radii.
- The `UI_STYLES` constants in `styles.ts` hardcode many Tailwind class strings. These must be updated in this phase since every component that imports `UI_STYLES` will inherit the changes.

**Completion Notes:**

- All deliverables met. `styles.css` contains only `base-*`, `fore-*`, `accent-*`, `danger-*`, and semantic aliases. Zero references to removed color names.
- `UI_STYLES` in `styles.ts` fully updated: `primary-*` → `accent-*`, `surface-*` → `base-*`/`fore-*`, `bg-white` → `bg-base-*`, `border-surface-*` → `border-border`.
- `pnpm build:web` passes cleanly. Dev server renders the dark background correctly (`rgb(17, 17, 16)` bg, `rgb(245, 240, 228)` fg).
- Accent and danger scales kept at full 11 shades (not trimmed). The plan said "trimmed to fewer shades" but all 11 are needed since downstream components use various shades (e.g. `danger-50` through `danger-700` appear in style guide do/don't boxes).
- Tailwind's default color palette was **not** suppressed. Decision deferred per plan — Phase 5 audit will catch built-in color bleedthrough (`bg-purple-100`, etc.).

**Learnings for Future Phases:**

1. **Tailwind v4 JIT tree-shakes `@theme` tokens.** CSS custom properties and utility classes are only emitted for tokens actually referenced in source code. This means tokens defined in `@theme` are "latent" until used — not a bug, just expected JIT behavior. Phase 2 components that reference new token classes (e.g. `bg-base-950`, `text-fore-50`) will trigger Tailwind to emit them.
2. **`border-border` works.** The semantic `--color-border` token with an oklch value (`oklch(0.9 0.01 90 / 0.12)`) generates a working `border-border` utility class in Tailwind v4.
3. **Pre-implementation color audit was valuable.** The ~630 occurrence inventory across the codebase provides a clear roadmap for Phases 2, 5, and 6. Heaviest impact areas: UI component library (~180 occurrences), style guide pages (~300 occurrences), and feature components (~60 occurrences).

**Token Mapping Reference (for use in subsequent phases):**

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `primary-*` | `accent-*` | Same hex values, renamed |
| `surface-50` to `surface-400` | `fore-*` (light end) | Use for text, light surfaces |
| `surface-500` to `surface-950` | `base-*` (dark end) | Use for backgrounds, dark surfaces |
| `bg-white` | `bg-base-800` or `bg-base-900` | Context-dependent |
| `text-surface-700` | `text-fore-300` | Body text on dark bg |
| `text-surface-500` | `text-fore-600` | Muted text on dark bg |
| `border-surface-300` | `border-border` | Semantic border token |
| `border-surface-100` | `border-base-700` | Subtle divider on dark bg |
| `text-white` | `text-fore-300` or `text-fg` | Context-dependent |
| `cyan-*`, `violet-*`, `rose-*` | Removed | Replaced by geometric patterns (Phase 3) |
| `success-*`, `warning-*`, `info-*` | Removed | Merged into default/accent/danger variants |

---

## Phase 2: Component Library — Dark Aesthetic & Variant Simplification ✅

**Status:** Complete (2026-03-31)

**Objective:** Restyle all UI components (`apps/web/src/app/shared/components/ui/`) for the dark aesthetic and strip the multi-color variant system down to three variants: `default`, `accent`, and `danger`.

**Key Deliverables:**

- **Button** (`ui-button.directive.ts`): Variants: `default` (linen outline/ghost), `accent` (orange fill), `danger`. Remove: primary, cyan, violet, rose, surface variants.
- **Badge** (`ui-badge.component.ts`): Variants: `default`, `accent`, `danger`. Remove all workout-type and semantic color variants.
- **Progress** (`ui-progress.component.ts`): Single track style (linen track, orange fill). Remove color prop.
- **Card** (`ui-card.component.ts`, `ui-card-header.directive.ts`, `ui-card-accent.directive.ts`): Dark card surfaces, linen borders, no gradient headers. Card accent becomes a left-border stripe in orange (default) or a geometric pattern element.
- **Toast** (`ui-toast.component.ts`): Variants: `success` → `default`, `error` → `danger`, others removed or merged.
- **Input/Form controls** (`ui-input.directive.ts`, checkbox, switch, select, form-field): Dark background inputs, linen-white text, orange focus ring, linen border.
- **Separator** (`ui-separator.component.ts`): Geometric-style divider — thick rule or double-line.
- All components: Remove any `bg-white` usage, replace surface neutrals with dark tokens.

**Dependencies:**

- Phase 1 must be complete (new token system must exist before component classes can reference new token names).

**Estimated Complexity:** L

- **Justification:** Many component files each require individual review and rewrite. The variant API change (removing color props) means TypeScript types must be updated. Some components have complex conditional class logic that needs full rethinking.

**Agent Strategy:**

- **Pre-implementation exploration:** Explore agent should read every file in `apps/web/src/app/shared/components/ui/` in full — catalog all color variant strings, TypeScript union types for `color` inputs, and Tailwind class strings used per state.
- **Parallel sub-tasks:** Components with no inter-dependencies can be split across three agents:
  - Agent A: Button, Badge, Progress (simpler, interactive elements)
  - Agent B: Card, Card Header, Card Accent, Toast (layout/container elements)
  - Agent C: Input, Form Field, Checkbox, Switch, Select, Separator (form controls)
  - All three agents run in parallel after exploration completes.
- **Isolation needs:** Use worktrees for each parallel agent to prevent merge conflicts.
- **Verification steps:** After merging parallel agents: run `pnpm build:web`, then do a full grep for removed color variant names (`cyan`, `violet`, `rose`, `success`, `warning`, `info`) across component files to confirm none remain.

**Risks & Mitigations:**

- **Risk:** Removing TypeScript union members from color input types may break feature components that pass the old color values.
  **Mitigation:** Grep for all usages of old color values (e.g. `color="violet"`) across feature components before removing types. Phase 5 fixes those usages.
- **Risk:** Dark-mode form controls have specific contrast requirements — dark inputs with dark borders can be invisible.
  **Mitigation:** Use linen-white (`--color-fore`) at ~10–15% opacity for border, higher opacity for text. Verify focus states with orange ring.

**Validation Criteria:**

- `pnpm build:web` and `pnpm lint:all` pass cleanly
- No TypeScript errors related to removed color variant types (or any remaining usages are caught and noted for Phase 5)
- Style guide `/guidelines/components` renders all components visually (even if guide content is stale — that's Phase 6)
- Every component renders correctly on the dark background

**Technical Notes:**

- Angular components use inline styles (per project convention). Class strings are often built with ternary/switch expressions inside template literals.
- Card header gradient backgrounds (`bg-linear-to-r from-{color}-400 to-{color}-600`) must be completely removed — replace with flat dark surfaces or a geometric pattern element.
- The `UI_STYLES` export from `styles.ts` is a single object imported by many components; changing it in Phase 1 cascades to all consumers automatically. **Phase 1 already updated `UI_STYLES`** — components importing it will inherit `accent-*`, `base-*`, `fore-*`, and `border-border` classes. Focus component-level work on the color variant maps and TypeScript types, not on `UI_STYLES` references.
- **Token mapping reference** is in Phase 1 completion notes above — use it when converting old color classes to new ones.
- **Tailwind JIT note:** New token utility classes (e.g. `bg-base-950`) only appear in the build output once they're referenced in source code. Don't be alarmed if a token "doesn't work" in dev tools — check that some component actually uses the class.

**Phase 2 Completion Notes:**

- All 27 UI component files updated (12 core components, 9 supporting directives, 5 type definitions, 1 test spec).
- Color variant API simplified across all components: `default`, `accent`, `danger` only.
- Zero old color tokens remain in `apps/web/src/app/shared/components/ui/` (verified via grep; only intentional `bg-white` on switch thumb and checkbox indicator remains for contrast).
- Toast variant simplified from `info | success | warning | error` → `default | error`. Service methods `info()`, `success()`, `warning()` all map to `'default'` internally.
- Card header gradients (`bg-linear-to-r from-*-400 to-*-600`) fully removed — replaced with flat dark surfaces.
- 4 feature component files required immediate fixes (type errors from removed color variants). Only type-error-causing references were fixed; template `text-surface-*` classes remain for Phase 5.
- Additional UI directives not listed in plan were discovered and fixed: table (5 directives), accordion (3 directives), dialog (3 directives), card-footer, form-field label/description, separator.
- `pnpm build:web` passes cleanly. Login page renders correctly on dark background with dark-themed form controls.

**Remaining old-token usage inventory (for Phase 4/5/6):**
- `navbar/navbar.ts`: 1 occurrence (`bg-white`) — Phase 4 scope
- `features/new-workout/`: ~23 occurrences (`text-surface-*`, `bg-surface-*`) — Phase 5 scope
- `features/workouts/`: ~6 occurrences — Phase 5 scope
- `features/style-guide/`: ~468 occurrences — Phase 6 scope (complete rewrite)
- Auth components: hardcoded purple heading — Phase 4 scope

**Learnings for Future Phases:**

1. **Plan underestimated the number of UI directives.** The plan listed 7 component files; the actual codebase had 27+ files needing changes. Future phases should always run a full directory listing before estimating scope.
2. **Type narrowing causes cascading build failures.** Removing TypeScript union members broke feature components that passed old values. Phase 5 feature updates are partially done as a result — the type-error fixes are in, but visual restyling remains.
3. **Parallel agent delegation was effective.** Three groups (interactive, containers, form controls) ran concurrently with no conflicts. A fourth agent handled the discovered additional directives.
4. **Progress component kept `color` prop** (with `'accent' | 'danger'`) rather than removing it entirely as the plan suggested. This preserves the API for danger-colored progress bars (e.g. storage warnings).

---

## Phase 3: Geometric Pattern System ✅

**Status:** Complete (2026-03-31)

**Objective:** Define a reusable geometric pattern system for workout-type differentiation and decorative UI elements. Each workout type (hypertrophy, strength, conditioning) gets a distinct SVG/CSS geometric pattern. Patterns are also used for hero/splash elements and as dividers/borders.

**Key Deliverables:**

- **Pattern definitions** — Three workout-type patterns (SVG-based, CSS-renderable):
  - Hypertrophy: Concentric circles or radial lines (growth, expansion)
  - Strength: Grid or cross-hatch (structure, force)
  - Conditioning: Diagonal parallel lines or wave (rhythm, flow)
- **Pattern utility classes** or Angular directives/components:
  - `[uiPattern]` directive (or CSS utility classes) accepting `type: 'hypertrophy' | 'strength' | 'conditioning'`
  - Renders the pattern as a subtle SVG background overlay on cards/sections
- **Hero pattern component**: Large bold geometric shape(s) for the home/splash area — inspired by the reference images (bold circles, vertical lines, geometric intersections). Uses brand orange or linen-white at low opacity on the dark background.
- **Geometric divider**: A CSS/SVG border treatment replacing simple `<hr>` elements — e.g. a thick horizontal rule with corner marks, or a double-line rule.
- All patterns are defined as inline SVG data URIs or `clip-path`/CSS `mask-image` — no external image files.

**Dependencies:**

- Phase 1 (tokens) must be complete so patterns use the correct color variables.
- Phase 2 can run in parallel with this phase (patterns are independent of component restyling).

**Estimated Complexity:** M

- **Justification:** SVG pattern design requires aesthetic judgment but the implementation surface is contained. The main complexity is encoding patterns as data URIs or CSS `background-image` values and ensuring they look right at multiple sizes.

**Agent Strategy:**

- **Pre-implementation exploration:** Explore agent should check if any SVG pattern utilities already exist in the codebase. Also search for how Iconoir icons are currently used (the icon system may inform how inline SVGs should be handled). Check `angular.json` for any asset pipeline configuration relevant to SVGs.
- **Parallel sub-tasks:** Pattern design and hero component can run in parallel:
  - Agent A: Define the three workout-type patterns as CSS/SVG, create the `[uiPattern]` directive
  - Agent B: Design and implement the hero geometric element component
  - Agent C: Implement the geometric divider component/directive
- **Isolation needs:** None required.
- **Verification steps:** Visually verify each pattern in the style guide (or temporarily in a test component). Confirm patterns are legible at card size (approx. 300–400px wide) and subtle enough not to overwhelm content.

**Risks & Mitigations:**

- **Risk:** SVG data URIs with CSS variables don't work — CSS custom properties can't be injected into `background-image: url("data:image/svg+xml,...")`.
  **Mitigation:** Use hardcoded hex values from the token definitions in SVG data URIs, or use `mask-image` + `background-color` approach to allow color token control.
- **Risk:** Patterns may be too visually noisy on the dark background.
  **Mitigation:** Set pattern opacity very low (5–15%). Use linen-white (`#F5F0E4`) at ~8% opacity as the default pattern ink color.

**Validation Criteria:**

- Three distinct patterns render correctly as decorative card backgrounds
- Hero geometric element renders on the home/splash view
- Geometric divider replaces standard separators in at least one view
- All patterns use no external image files (pure CSS/SVG inline)
- `pnpm build:web` passes; no bundle size regressions from large embedded SVGs

**Technical Notes:**

- Angular's inline template convention means patterns will be applied via CSS class + directive, not separate template files.
- For workout-type pattern association, a simple map in a service or constant is sufficient: `{ hypertrophy: 'pattern-circles', strength: 'pattern-grid', conditioning: 'pattern-lines' }`.
- Keep SVG data URIs compact — avoid complex paths. Simple geometric primitives (circles, lines, rectangles) are sufficient and keep bundle size low.

**Phase 3 Completion Notes:**

- All 4 deliverables met: 3 repeating patterns, pattern overlay component, hero component, divider component.
- **Architecture:** Implemented as Angular `@Component`s (not directives). `UiPatternComponent` is the repeating overlay; `UiPatternHeroComponent` is the bold decorative SVG; `UiPatternDividerComponent` is the geometric divider. All standalone, following existing codebase conventions (`input()`, `computed()`, `cx()`, `data-ui` attributes).
- **Pattern CSS defined in global `styles.css`** — three classes (`pattern-hypertrophy`, `pattern-strength`, `pattern-conditioning`) with SVG data URI backgrounds. This avoids Angular's component style budget (4kB warn / 8kB error) per the plan's recommendation.
- **Hardcoded hex colors in SVGs** — used `#F5F0E4` (fore-300) for pattern strokes. The mask-image approach was not needed since pattern color is static. Opacity is a separate concern controlled via the component's `opacity` input (default: 0.08).
- **Hero design:** 1200×400 viewBox with partial circles (accent orange `#FF9500`), vertical grid lines (linen-white), horizontal center line, and accent intersection marks. All at very low opacity (.04–.2) for subtlety.
- **Divider design:** Pure Tailwind CSS (no SVG) — horizontal rules with a rotated diamond centerpiece. Has `role="separator"` for a11y.
- **No feature integration yet.** Pattern components are built and exported but not placed in feature views. That work belongs to Phase 4 (hero on auth/splash) and Phase 5 (patterns on workout cards).
- `pnpm build:web` passes cleanly. No bundle size increase from pattern SVGs.

**Files created:**
- `apps/web/src/app/shared/components/ui/pattern/ui-pattern.types.ts`
- `apps/web/src/app/shared/components/ui/pattern/ui-pattern.component.ts`
- `apps/web/src/app/shared/components/ui/pattern/ui-pattern-hero.component.ts`
- `apps/web/src/app/shared/components/ui/pattern/ui-pattern-divider.component.ts`

**Files modified:**
- `apps/web/src/styles.css` — added 3 pattern CSS classes
- `apps/web/src/app/shared/components/ui/index.ts` — added barrel exports

**Learnings for Future Phases:**

1. **Global CSS for pattern backgrounds is the right call.** Defining SVG data URI backgrounds in component styles would risk hitting Angular's style budget and creates encoding headaches. Global `styles.css` classes are always available and have no budget limit.
2. **Hardcoded hex in SVGs is fine for a static theme.** The mask-image approach adds complexity for flexibility we don't need. If dynamic theming is ever required, the SVGs can be migrated to mask-image + background-color at that point.
3. **Phase was small and self-contained.** No cascading type errors, no downstream breakage. Creating new components is lower-risk than modifying existing ones (Phase 2 lesson).
4. **Visual verification deferred.** Patterns need to be visually checked in context once placed on cards (Phase 5) and in the style guide (Phase 6). The opacity values (0.08 default) may need tuning.

**Pattern component reference (for use in Phases 4–6):**

| Component | Selector | Purpose | Key Inputs |
|-----------|----------|---------|------------|
| `UiPatternComponent` | `<ui-pattern>` | Repeating SVG overlay (absolute positioned) | `type` (required): `'hypertrophy' \| 'strength' \| 'conditioning'`, `opacity` (default: 0.08) |
| `UiPatternHeroComponent` | `<ui-pattern-hero>` | Bold decorative SVG for hero/splash areas | None (size via CSS class e.g. `class="h-64"`) |
| `UiPatternDividerComponent` | `<ui-pattern-divider>` | Geometric divider with diamond center | None |

**Usage pattern:**
```html
<!-- Card with workout pattern overlay -->
<ui-card padding="none" class="relative">
  <ui-pattern type="hypertrophy" />
  <div uiCardBody class="relative z-10">Content</div>
</ui-card>
```

---

## Phase 4: App Shell & Navigation Redesign ✅

**Status:** Complete (2026-03-31)

**Objective:** Apply the new dark aesthetic to the app shell — root layout, navigation bar, header, and any global chrome elements. These are the highest-visibility surfaces and frame every feature view.

**Key Deliverables:**

- **Root app component** (`app.component.ts`): Dark background base (`bg-base-950`), linen-white text default
- **Navigation/header** (`navbar/navbar.ts`): Has `bg-white shadow` — replace with dark aesthetic. Stark nav with linen-white labels, orange accent on active route, geometric divider between nav and content
- **Auth pages** (login/signup): Restyled for dark aesthetic with hero geometric element (`<ui-pattern-hero>`). **Known issue from Phase 2:** Login heading uses hardcoded purple/violet color — must be replaced with accent or fore token
- **Coming soon page** (`coming-soon` route): Restyled
- **Global scroll/layout**: Ensure scrollbar styling, body background, and overflow handling fit the dark aesthetic
- No visual remnants of the old light-mode shell
- **Geometric divider** (`<ui-pattern-divider>`) between nav and content area (if appropriate)

**Dependencies:**

- Phase 1 (tokens) must be complete. ✅
- Phase 2 (component library) should be complete or substantially underway so restyled components are available. ✅
- Phase 3 (patterns) should be complete for hero elements. ✅

**Estimated Complexity:** M

- **Justification:** Shell components are few in number but high in visibility. The auth pages and coming-soon page are relatively simple. The main nav requires careful attention to active state affordance.

**Agent Strategy:**

- **Pre-implementation exploration:** Explore agent should read: `app.component.ts`, all route guard and shell layout components, auth feature components (login/signup), and the coming-soon component. Map which component owns the outermost layout and background.
- **Parallel sub-tasks:** Auth pages and app shell can run in parallel:
  - Agent A: Root app component + navigation shell
  - Agent B: Auth pages (login, signup) + coming-soon page
- **Isolation needs:** None required.
- **Verification steps:** Visually verify the app shell in dev server. Navigate between routes to confirm nav active state (orange accent), dark background persists across routes, and auth pages look correct.

**Risks & Mitigations:**

- **Risk:** Body/html background defaults to white, creating a flash of white before Angular mounts.
  **Mitigation:** Already resolved in Phase 1 — `html, body { background-color: var(--color-bg); }` is in `styles.css`.
- **Risk:** Navigation structure may not match the new aesthetic without broader layout changes.
  **Mitigation:** Explore agent maps the full shell hierarchy before implementation. Limit scope to restyling — do not restructure nav layout unless necessary.

**Validation Criteria:**

- App shell renders correctly in dev server with dark background throughout
- Navigation active state uses brand orange
- Auth pages and coming-soon page are fully restyled
- No light-colored backgrounds visible in the shell chrome
- `pnpm build:web` and `pnpm lint:all` pass

**Phase 4 Completion Notes:**

- All deliverables met. Five files modified: layout, navbar, login, register, maintenance.
- **Layout component** (`layout.ts`): `bg-surface-50` → `bg-bg text-fg`. Removed duplicate `@HostBinding('class')` that conflicted with decorator `host.class` — this was a pre-existing bug where both applied simultaneously. The background lives on the `<app-layout>` element, not `<body>` (body bg is handled by `styles.css` global rule from Phase 1).
- **Navbar**: `bg-white shadow` → `border-b border-base-700`. Linen-white title (`text-fore-300`), muted icons (`text-fore-500`) with accent-orange hover. Slightly tighter dimensions (h-14, w-5 icons) for a more minimal feel.
- **Auth pages**: Both login and register now have a `<ui-pattern-hero>` header section (h-48, overflow hidden) with the heading text overlaid at `z-10`. Indigo links → `text-accent-500`. Social auth divider on login uses `bg-bg` background to mask the border line.
- **Maintenance page**: Hero pattern backdrop with centered "Trakn / Coming Soon" in linen-white. Uppercase tracking-wide treatment matches navbar title.
- **`<ui-pattern-divider>` not used** between nav and content. The simple `border-b border-base-700` on the nav provides cleaner separation — the diamond divider felt too decorative for the minimal app shell chrome.
- Zero old light-mode tokens remain in any shell/auth/maintenance files (verified via grep).
- `pnpm build:web` passes cleanly.

**Files modified:**
- `apps/web/src/app/shared/components/layout/layout.ts`
- `apps/web/src/app/shared/components/navbar/navbar.ts`
- `apps/web/src/app/features/auth/login/login.component.ts`
- `apps/web/src/app/features/auth/register/register.component.ts`
- `apps/web/src/app/features/maintenance/maintenance.component.ts`

**Learnings for Future Phases:**

1. **Phase was correctly scoped as M.** Five files, all straightforward restyling. No type errors, no cascading breakage. Shell components are simpler than feature components.
2. **Layout hierarchy matters.** The background color lives on `<app-layout>` (not `<body>`), which means auth pages (using `LayoutMinimalComponent`) also inherit it. No need to set background on individual page components.
3. **`@HostBinding` vs `host:{}` conflict.** The layout component had both — Angular applies both, creating unpredictable class merges. Future phases should watch for this pattern in other components. Prefer `host: { class: ... }` (the decorator approach) exclusively.
4. **Parallel agent delegation was unnecessary.** Five files with simple token swaps completed faster as sequential edits than they would have with agent coordination overhead. Reserve parallel agents for phases with 10+ files or complex logic.

---

## Phase 5: Feature Component Updates ✅

**Status:** Complete (2026-03-31)

**Objective:** Update all feature-level components to use the new dark aesthetic tokens, simplified component variants, and geometric patterns for workout-type differentiation.

**Key Deliverables:**

- **Home component** (`features/home/home.component.ts`): Replace workout-type color badges (`bg-purple-100`, `bg-red-100`, `bg-green-100`) with geometric pattern indicators using `<ui-pattern type="...">`. Apply `<ui-pattern-hero>` to the home splash/header area.
- **Workout feature components**: Apply geometric patterns to workout-type cards and list items. Replace any hardcoded old color classes.
- **All feature components**: Audit and replace any remaining uses of removed color tokens (`cyan-*`, `violet-*`, `rose-*`, `surface-*`, `bg-white`) with new dark aesthetic tokens.
- **No functional changes** — only visual/styling updates.

**Partial work from Phase 2:** 4 feature component files already had type-error-causing color prop values fixed (`exercise-card`, `interval-card`, `workout-type-selector`, `style-guide-components`). Their component color inputs now use valid `default`/`accent`/`danger` values. However, ~23 template-level `text-surface-*` / `bg-surface-*` class references remain in `new-workout/` and ~6 in `workouts/`. These are the primary remaining work items.

**Dependencies:**

- Phases 1–3 must all be complete (tokens, components, patterns must all be in place before features can use them). ✅
- Phase 4 (shell) should be complete for a consistent baseline. ✅

**Estimated Complexity:** M

- **Justification:** The home component has known color class issues (uses `purple-100`, `red-100`, `green-100` — Tailwind built-ins, not custom tokens). A full audit across all feature components is needed. Volume of files is the main complexity driver.

**Agent Strategy:**

- **Pre-implementation exploration:** Explore agent should run a comprehensive grep across `apps/web/src/app/features/` for:
  - All Tailwind color classes referencing removed palettes: `purple-*`, `red-*`, `green-*`, `cyan-*`, `violet-*`, `rose-*`, `surface-*`, `bg-white`, `text-white`
  - All usages of old component color prop values: `color="cyan"`, `color="violet"`, `color="rose"`, `color="success"`, `color="warning"`, `color="info"`
  - Return a complete file-by-file inventory.
- **Parallel sub-tasks:** Feature components can be split by feature directory:
  - Agent A: `features/home/`
  - Agent B: `features/workouts/` (or equivalent workout feature dir)
  - Agent C: Any remaining feature directories
- **Isolation needs:** None required.
- **Verification steps:** Re-run the initial grep after implementation — confirm zero occurrences of removed color classes remain in `features/`. Visual audit of each feature route in dev server.

**Risks & Mitigations:**

- **Risk:** Home component uses raw Tailwind built-in color classes (`purple-100`) not in the custom palette, which still work even after palette removal (Tailwind's default palette is not removed by `@theme`).
  **Mitigation:** In Phase 1, explicitly override/remove default Tailwind color utilities if needed, or rely on the Phase 5 audit to find and replace all such usages.
- **Risk:** Some workout-type pattern placements may need design judgment calls (where exactly to place the pattern on a card).
  **Mitigation:** Establish a consistent pattern: pattern appears as a right-side or background overlay on workout-type cards, always at low opacity.

**Validation Criteria:**

- Zero occurrences of removed palette class names in `features/` directory
- All three workout types visually distinguishable by their geometric patterns in the workout list/cards
- Hero geometric element present on home view
- `pnpm build:web`, `pnpm lint:all`, and `pnpm test:web` all pass

**Phase 5 Completion Notes:**

- All 12 files updated: 11 feature components + 1 shared component (`workout-editor`).
- **93 old-token occurrences replaced** across feature files; an additional ~17 in `workout-editor.component.ts` (shared component discovered during reflection spot-check).
- **Workout-type color badges simplified** — `bg-purple-100`/`bg-red-100`/`bg-green-100` per-type badges replaced with uniform `bg-base-700 text-fore-300`. Type label text is sufficient differentiation; color-coding was from the old multi-color system.
- **No `<ui-pattern>` overlays placed on feature views.** The plan suggested adding patterns to workout cards and a hero pattern on home. Current layouts are compact list items, not large cards — patterns would be noisy. Pattern integration should happen during a future layout redesign, not as part of token migration.
- **`getTypeBadgeClass()` method removed** from `workouts.component.ts` (was the per-type color switch statement).
- **Stepper redesigned** in `new-workout.component.ts`: active steps use `bg-accent-500 text-base-950` (orange with dark text), inactive steps use `bg-base-600 text-fore-500`.
- **Error/success/warning banners standardized** across all components: success → `bg-accent-500/10 border-accent-500/20`, error → `bg-danger-500/10 border-danger-500/20`, warning → same accent pattern.
- Zero old tokens remain outside `features/style-guide/` and the intentional `bg-white` on checkbox/switch indicators.
- `pnpm build:web` passes cleanly.

**Files modified:**
- `features/home/home.component.ts`
- `features/workouts/workouts.component.ts`
- `features/workouts/workout-detail.component.ts`
- `features/new-workout/new-workout.component.ts`
- `features/new-workout/components/workout-results.component.ts`
- `features/new-workout/components/exercise-card.component.ts`
- `features/new-workout/components/interval-card.component.ts`
- `features/new-workout/components/workout-type-selector.component.ts`
- `features/new-workout/components/workout-params-form.component.ts`
- `features/new-workout/components/revision-input.component.ts`
- `features/profile/profile.component.ts`
- `shared/components/workout-editor/workout-editor.component.ts`

**Learnings for Future Phases:**

1. **Audit must include `shared/components/` not just `features/`.** The `workout-editor` component was in `shared/` and was missed by the initial explore agent that only searched `features/`. The reflection spot-check caught it. Phase 6 should audit the entire `src/app/` tree, not just `features/style-guide/`.
2. **Compact list UIs don't benefit from pattern overlays.** The plan's vision of patterns on workout cards assumed larger card layouts. Current feature views use tight list rows where a background pattern at any opacity is noise, not decoration. Pattern integration is a design/layout concern, not a token migration task.
3. **Banner color standardization emerged organically.** The plan didn't call for standardizing alert/banner colors, but the migration naturally led to a consistent pattern: accent for success/info, danger for errors. This should be documented in the style guide (Phase 6).

---

## Phase 6: Style Guide Rewrite ✅

**Status:** Complete (2026-03-31)

**Objective:** Rewrite all style guide pages (`features/style-guide/`) to document the new stark aesthetic design system: tokens, patterns, component variants, and typography.

**Completion Notes:**
- All 8 existing style guide pages rewritten with new dark-aesthetic tokens
- New Patterns page created (`style-guide-patterns.component.ts`) documenting all three workout-type patterns, hero pattern, divider, and opacity reference
- Route added to `style-guide.routes.ts`, nav link added to `style-guide.component.ts`
- Colors page reduced from 7 scales (primary, cyan, violet, rose, danger, success, warning, info, surface) to 4 (base, fore, accent, danger) plus semantic aliases
- Overview page rewritten with new design principles (Stark & Minimal, Pattern-Driven, Purposeful Contrast)
- Forms page updated to document dark-aesthetic form controls, removed outdated Phase 4 warning
- Zero old tokens remain in style guide (verified by grep)
- `pnpm build:web` passes cleanly

**Key Deliverables:**

- **Overview page** (`style-guide-overview.component.ts`): Updated design principles for the stark aesthetic. New at-a-glance reference for the dark/orange/linen system.
- **Colors page** (`style-guide-colors.component.ts`): Showcase new token set only (base, fore, accent, danger). Remove all old palette swatches.
- **Typography page** (`style-guide-typography.component.ts`): Retained type scale but restyled for dark background. Demonstrate Plus Jakarta Sans on dark.
- **Spacing page**: Retained — spacing system is unchanged.
- **Iconography page**: Retained — icon system is unchanged.
- **Components page** (`style-guide-components.component.ts`): Updated to showcase new simplified component variants (default, accent, danger only).
- **Patterns page** (new page): Document the three geometric workout-type patterns (`<ui-pattern>` with `hypertrophy`, `strength`, `conditioning`), the hero element (`<ui-pattern-hero>`), and the divider (`<ui-pattern-divider>`). Show each pattern with its associated workout type label. Add route to `style-guide.routes.ts` and nav link to `style-guide.component.ts`.
- **Forms page**: Updated to show dark-aesthetic form controls.

**Dependencies:**

- All previous phases must be complete — the style guide documents the finished system. ✅

**Estimated Complexity:** S

- **Justification:** The style guide is documentation, not functional code. Each page is a standalone Angular component with hardcoded template content. No complex logic — mainly template and content rewrites.

**Agent Strategy:**

- **Pre-implementation exploration:** Explore agent should read all existing style guide page component files to understand their current structure and content volume.
- **Parallel sub-tasks:** Style guide pages are fully independent — all can be rewritten in parallel:
  - Agent A: Overview + Colors pages
  - Agent B: Typography + Spacing + Iconography pages
  - Agent C: Components + Forms pages
  - Agent D: New Patterns page (requires creating a new component and adding it to the style guide routes)
- **Isolation needs:** None required.
- **Verification steps:** Navigate each style guide route in dev server. Confirm no broken component usages or references to removed color variants.

**Risks & Mitigations:**

- **Risk:** Adding a new Patterns page requires updating the style guide routing config.
  **Mitigation:** Explore agent maps the routing structure (`style-guide.routes.ts` or equivalent) before implementation.

**Validation Criteria:**

- All style guide routes render correctly with no console errors
- No references to removed color names (cyan, violet, rose, success, warning, info) in style guide component templates
- New Patterns page exists and documents all three workout-type patterns
- `pnpm build:web` passes

---

## Final Recommendations

### Critical Path

Phases must execute in this order:

```
Phase 1 (Tokens)
    └── Phase 2 (Components) ─┐
    └── Phase 3 (Patterns)   ─┤─ Phase 4 (Shell) ── Phase 5 (Features) ── Phase 6 (Style Guide)
```

- **Phase 1** is the strict prerequisite for all other phases.
- **Phases 2 and 3** can run in parallel after Phase 1.
- **Phase 4** should begin after Phase 2 is complete (needs restyled components) and Phase 3 is complete (needs hero pattern).
- **Phase 5** requires Phases 1–4 all complete.
- **Phase 6** requires all previous phases complete.

### Technical Risks

1. **Tailwind built-in color bleedthrough** — The project's custom `@theme` tokens add to Tailwind's defaults, not replace them. Classes like `bg-purple-100` still work even after removing `violet-*` custom tokens. The Phase 5 audit must catch these.
   **Mitigation:** In Phase 1, evaluate whether to add `@theme { --color-purple-*: initial; }` overrides to suppress default Tailwind palettes, forcing all color usage to go through custom tokens.

2. **SVG pattern color in CSS variables** — CSS custom properties cannot be interpolated inside `background-image` data URIs. Patterns requiring dynamic color changes via CSS variables require a different approach.
   **Mitigation:** Use hardcoded hex values in SVG data URIs for the near-static dark aesthetic. If dynamic theming is needed later, switch to `mask-image` + `background-color` approach.

3. **Dark background flash on load** — Without explicit `body` background color in global CSS, there will be a white flash before Angular renders.
   **Mitigation:** Phase 1 must include `body { background-color: #111110; }` in global styles outside `@theme`.

4. **Bundle size from SVG patterns** — Inline SVG data URIs can be verbose, especially if repeated.
   **Mitigation:** Keep geometric patterns extremely simple (2–5 SVG primitive elements each). Base64-encode only if necessary; `encodeURIComponent` is more readable and often smaller.

5. **Angular component style budget** — `angular.json` has a 4kB warning / 8kB error budget per component style. Inline SVG patterns in component styles could trigger this.
   **Mitigation:** Define patterns in global `styles.css` as utility classes rather than in individual component styles.

### Architecture Decisions

1. ~~**Exact hex values for base tokens**~~ — ✅ Resolved in Phase 1: `#111110` (base/bg), `#F5F0E4` (fore/fg), `#FF9500` (accent-500).

2. **Whether to suppress Tailwind's default palette** — Deferred to Phase 5. Default Tailwind colors (e.g. `bg-purple-100`) remain available. The Phase 5 audit will catch bleedthrough; suppression can be added then if needed.

3. **Geometric pattern format** — SVG data URI (simpler, no Angular infrastructure needed) vs. Angular SVG component (more flexible, supports CSS variables). For this project's complexity level, data URIs are recommended. To be resolved in Phase 3.

### Alternative Approaches

**Alternative: Dark-mode via CSS `prefers-color-scheme` + CSS variables**
Instead of hardcoding a dark-only theme, implement light/dark mode properly with CSS `prefers-color-scheme`. This is significantly more complex (every token needs a light and dark value, media queries throughout) and is not what was described. Not recommended unless the app needs to support both modes.

**Alternative: Keep the multi-color variant API, just restyle the colors**
Instead of removing workout-type color variants, restyle them all to orange/dark tones. This preserves API compatibility but results in a confused design (why have a `color="cyan"` variant if cyan renders as orange?). Not recommended.

### Prerequisites Before Starting Phase 1

- Hex values confirmed: `#111110` (almost-black), `#F5F0E4` (linen-white), `#FF9500` (brand orange)
- Ensure `pnpm install` and `pnpm dev:web` run cleanly on the current `main` branch before making changes
