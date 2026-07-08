/**
 * Extracts initials from a full name string.
 * e.g. "John Doe" → "JD", "Alice" → "AL", undefined → "??"
 */
export function getInitials(name?: string): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Formats a date string (and optional time) into a human-readable format.
 * e.g. ("2024-10-12", "19:00") → "Oct 12, 7:00 PM"
 *      ("2024-10-12")          → "Oct 12"
 */
export function formatDateTime(date?: string, time?: string): string {
  if (!date) return "";
  try {
    let d: Date;
    // Standardize parsing to avoid Hermes engine/timezone parsing bugs
    const timeParts = date.split(/[ T]/);
    const cleanDateStr = timeParts[0];
    let timeVal = time;
    if (!timeVal && timeParts.length > 1) {
      timeVal = timeParts[1];
    }

    const parts = cleanDateStr.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else if (parts[2].length === 4) {
        // DD-MM-YYYY
        d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      } else {
        d = new Date(date);
      }
    } else {
      d = new Date(date);
    }

    if (isNaN(d.getTime())) return date;

    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = MONTH_NAMES[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    if (timeVal) {
      const [h, m] = timeVal.split(":");
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${month} ${day} ${year}, ${hour12}:${m} ${ampm}`;
    }
    return `${month} ${day} ${year}`;
  } catch {
    return date;
  }
}

/**
 * Formats a numeric amount or numeric string to a currency representation.
 * e.g. (250, "$") → "$250.00", "15.5" → "15.50"
 */
export function formatAmount(amount?: number | string, symbol?: string): string {
  const amt = Number(amount || 0);
  const formatted = amt.toFixed(2);
  return symbol ? `${symbol}${formatted}` : formatted;
}
