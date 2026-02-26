type ClassValue = string | false | null | undefined;

/**
 * Minimal class concatenation helper for wrapper internals.
 * This intentionally avoids additional dependencies in Phase 2.
 */
export function cx(...values: ClassValue[]): string {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}
