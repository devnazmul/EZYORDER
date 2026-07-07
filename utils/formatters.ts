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
    const d = new Date(date);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();

    if (time) {
      const [h, m] = time.split(":");
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${month} ${day}, ${hour12}:${m} ${ampm}`;
    }
    return `${month} ${day}`;
  } catch {
    return date;
  }
}
