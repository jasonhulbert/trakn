/**
 * Shared Tailwind class tokens for UI wrappers.
 * Keep these small and composable; wrappers can combine/extend them as needed.
 */
export const UI_STYLES = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary-500',
  focusVisibleRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  borderBase: 'border border-surface-300',
  radiusMd: 'rounded-md',
  radiusLg: 'rounded-lg',
  textBody: 'text-sm text-surface-700',
  inputBase: 'w-full px-3 py-2 border border-surface-300 rounded-md bg-white',
  inputInteractive: 'focus:outline-none focus:ring-2 focus:ring-primary-500',
  textareaBase: 'w-full px-3 py-2 border border-surface-300 rounded-md bg-white resize-none',
  cardBase: 'bg-white border border-surface-300 rounded-lg',
  mutedText: 'text-surface-500',
  errorText: 'text-danger-600',
  divider: 'border-t border-surface-100',
} as const;
