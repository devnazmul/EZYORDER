export function formatAmount(
  amount?: number | string,
  symbol?: string,
): string {
  const numericStr =
    typeof amount === "string" ? amount.replace(/[^0-9.-]/g, "") : amount;
  const val = Number(numericStr || 0);
  const prefix = val < 0 ? "-" : "";
  const formatted = Math.abs(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${prefix}${symbol || ""}${formatted}`;
}
