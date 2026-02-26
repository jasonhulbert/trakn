# UI Wrappers (`shared/components/ui`)

This directory contains the `Ui*` wrapper layer for Angular Primitives and local semantic UI wrappers.

## Status

- Phase 2 scaffolding is in place (dependency setup, barrel exports, shared style helpers, app-level overlay providers)
- Primitive wrappers will be added in Phases 3-5

## Conventions

- Use local `Ui*` naming (`UiButtonDirective`, `UiSelectComponent`, etc.)
- Prefer thin wrappers over app-specific abstractions
- Keep wrappers standalone
- Keep form state ownership in Angular forms (wrappers should be presentational/compositional)
- Use `_internal/` helpers for shared Tailwind class strings and small utilities

## File Layout (Phase 2)

- `index.ts`: public UI barrel
- `providers.ts`: app-level overlay providers/config (`dialog`, `toast`)
- `_internal/`: shared utility functions and style tokens for wrapper implementation

## Notes

- `Table` is expected to be a local semantic wrapper (Tailwind-styled) rather than Angular Primitives-backed.
- Avoid adding `class-variance-authority` / `tailwind-merge` until wrapper duplication is demonstrated.
