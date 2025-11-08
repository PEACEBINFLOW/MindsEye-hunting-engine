// server/src/utils/binflowSchema.js
// ---------------------------------------------------
// BinFlow Utilities - categorize event "lanes"
// ---------------------------------------------------

// Example lanes that define flow states
export const lanes = ['alpha', 'beta', 'gamma'];

// Example tag function for quick categorization
export function tagFromValue(value) {
  if (value == null) return 'unknown';
  if (value > 0.8) return 'spike';
  if (value < 0.2) return 'flat';
  return 'normal';
}
