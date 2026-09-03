/**
 * Parses a UTC date string in "DD-MM-YYYY HH:mm:ss" or ISO format,
 * and formats it into the user's local timezone (Pakistan, Bangladesh, UK, USA, etc.).
 * Returns a 12-hour formatted time (e.g. "06:19 PM").
 */
export default function formatUtcToLocalTime(utcDateStr?: string | null): string {
  if (!utcDateStr) return "";
  try {
    const trimmed = utcDateStr.trim();
    let year = 0, month = 0, day = 0, hours = 0, minutes = 0, seconds = 0;
    let matched = false;

    const matchDdmmyyyy = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (matchDdmmyyyy) {
      day = parseInt(matchDdmmyyyy[1], 10);
      month = parseInt(matchDdmmyyyy[2], 10) - 1;
      year = parseInt(matchDdmmyyyy[3], 10);
      hours = matchDdmmyyyy[4] ? parseInt(matchDdmmyyyy[4], 10) : 0;
      minutes = matchDdmmyyyy[5] ? parseInt(matchDdmmyyyy[5], 10) : 0;
      seconds = matchDdmmyyyy[6] ? parseInt(matchDdmmyyyy[6], 10) : 0;
      matched = true;
    } else {
      const matchYyyymmdd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
      if (matchYyyymmdd) {
        year = parseInt(matchYyyymmdd[1], 10);
        month = parseInt(matchYyyymmdd[2], 10) - 1;
        day = parseInt(matchYyyymmdd[3], 10);
        hours = matchYyyymmdd[4] ? parseInt(matchYyyymmdd[4], 10) : 0;
        minutes = matchYyyymmdd[5] ? parseInt(matchYyyymmdd[5], 10) : 0;
        seconds = matchYyyymmdd[6] ? parseInt(matchYyyymmdd[6], 10) : 0;
        matched = true;
      }
    }

    if (!matched) {
      const parsedDate = new Date(trimmed);
      if (isNaN(parsedDate.getTime())) return utcDateStr;
      return parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    if (isNaN(utcDate.getTime())) return utcDateStr;

    return utcDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return utcDateStr;
  }
}
