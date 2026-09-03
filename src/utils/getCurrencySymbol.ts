import { currencyOptions } from "@/constants/currency";

/**
 * Retrieves the currency symbol based on the currency code (e.g. "USD" -> "$").
 * Defaults to "£" if no matching currency is found.
 */
export function getCurrencySymbol(currencyCode?: string): string {
  if (!currencyCode) return "£";
  const matched = currencyOptions?.find(
    (curr: any) => curr?.value === currencyCode?.toUpperCase()
  );
  return matched?.symbol || "£";
}
