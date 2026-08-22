/**
 * Formats underscores and casing of text labels (e.g. status strings).
 * e.g., "FAILED_DELIVERY" → "Failed delivery"
 *       "pending" → "Pending"
 *       "PREPAID" → "Prepaid"
 */
export function formatLabel(str?: string): string {
  if (!str) return "";
  const formatted = str.replace(/_/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
}
