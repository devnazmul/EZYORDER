/**
 * Parses a UTC date string in "DD-MM-YYYY HH:mm:ss" or ISO format,
 * and formats it into the user's local timezone (Pakistan, Bangladesh, UK, USA, etc.).
 * Returns a 12-hour formatted time (e.g. "06:19 PM").
 */
export default function formatUtcToLocalTime(utcDateStr?: string | null): string {
  if (!utcDateStr) return "";
  try {
    const parts = utcDateStr.trim().split(" ");
    let year = 0;
    let month = 0;
    let day = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Check if the date portion is delimited by dashes (e.g., DD-MM-YYYY or YYYY-MM-DD)
    if (parts[0].includes("-")) {
      const dateParts = parts[0].split("-");
      if (dateParts.length === 3) {
        if (dateParts[2].length === 4) {
          // DD-MM-YYYY
          day = parseInt(dateParts[0], 10);
          month = parseInt(dateParts[1], 10) - 1;
          year = parseInt(dateParts[2], 10);
        } else {
          // YYYY-MM-DD
          year = parseInt(dateParts[0], 10);
          month = parseInt(dateParts[1], 10) - 1;
          day = parseInt(dateParts[2], 10);
        }
      } else {
        return utcDateStr;
      }
    } else {
      // Standard ISO parser fallback
      const parsedDate = new Date(utcDateStr);
      if (isNaN(parsedDate.getTime())) return utcDateStr;
      return parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Extract time components if present
    if (parts.length > 1 && parts[1].includes(":")) {
      const timeParts = parts[1].split(":");
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
      if (timeParts.length > 2) {
        seconds = parseInt(timeParts[2], 10);
      }
    }

    // Construct Date object as a UTC timestamp
    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    if (isNaN(utcDate.getTime())) return utcDateStr;

    // Output local time string formatted to 12-hour format automatically converted to device timezone
    return utcDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return utcDateStr;
  }
}
