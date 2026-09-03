/**
 * Formats a 24-hour time string (e.g. "19:00", "09:30:00") to a 12-hour formatted time string (e.g. "07:00 PM", "09:30 AM").
 */
export function formatTime(timeStr?: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hours = Number.parseInt(parts[0], 10);
  const minutes = parts[1];
  if (Number.isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

export default formatTime;
