/**
 * Formats a rating value into "numerator/5" (e.g. 5 -> "5/5", 3.5 -> "3.5/5", 4.25 -> "4.25/5").
 */
export function formatRating(rating: number | string | undefined | null): string {
  const num = typeof rating === "number" ? rating : parseFloat(String(rating || 0));
  if (isNaN(num) || num <= 0) return "0/5";
  const formattedNum = Number.isInteger(num) ? String(num) : String(parseFloat(num.toFixed(2)));
  return `${formattedNum}/5`;
}
