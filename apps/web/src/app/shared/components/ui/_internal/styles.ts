/**
 * Shared Tailwind class tokens for UI wrappers.
 * Keep these small and composable; wrappers can combine/extend them as needed.
 */
export const UI_STYLES = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-accent-500',
  focusVisibleRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  borderBase: 'border border-border',
  radiusMd: 'rounded-md',
  radiusLg: 'rounded-lg',
  textBody: 'text-sm text-fore-300',
  inputBase: 'w-full px-3 py-2 border border-border rounded-md bg-base-800',
  inputInteractive: 'focus:outline-none focus:ring-2 focus:ring-accent-500',
  textareaBase: 'w-full px-3 py-2 border border-border rounded-md bg-base-800 resize-none',
  cardBase: 'bg-base-900 border border-border rounded-lg',
  mutedText: 'text-fore-600',
  errorText: 'text-danger-500',
  divider: 'border-t border-base-700',
} as const;
