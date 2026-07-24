/**
 * Formats a numeric amount or numeric string to a currency representation.
 * e.g. (250, "$") → "$250.00", "£15.5" → "£15.50"
 * If the input string contains a currency symbol or other non-numeric characters,
 * they are removed before parsing and formatting.
 */
export function formatAmount(amount?: number | string, symbol?: string): string {
  let rawAmount = amount;
  if (typeof rawAmount === "string") {
    // Strip everything except numbers, decimal point, and minus sign
    rawAmount = rawAmount.replace(/[^0-9.-]/g, "");
  }
  const amt = Number(rawAmount || 0);
  const formatted = amt.toFixed(2);
  return symbol ? `${symbol}${formatted}` : formatted;
}
