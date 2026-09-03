import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const COMMON_PARSE_FORMATS = [
  "YYYY-MM-DDTHH:mm:ss.SSSZ",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DD",
  "DD-MM-YYYY HH:mm:ss",
  "DD-MM-YYYY HH:mm",
  "DD-MM-YYYY",
  "DD/MM/YYYY HH:mm:ss",
  "DD/MM/YYYY HH:mm",
  "DD/MM/YYYY",
  "YYYY/MM/DD HH:mm:ss",
  "YYYY/MM/DD HH:mm",
  "YYYY/MM/DD",
];

/**
 * Formats a date (and optional time) using dayjs into any specified format.
 * Supports parsing DD-MM-YYYY, YYYY-MM-DD, ISO strings, Date objects, and timestamps.
 *
 * @param date - Date input (string, Date, number, dayjs.Dayjs, null, undefined)
 * @param formatStr - Desired dayjs format string (default: "YYYY-MM-DD")
 * @param timeStr - Optional separate time string (e.g. "18:55" or "18:55:21")
 * @returns Formatted date string or empty string if date is invalid/empty
 */
export function formatDate(
  date?: string | Date | number | dayjs.Dayjs | null,
  formatStr: string = "YYYY-MM-DD",
  timeStr?: string,
): string {
  if (date === undefined || date === null || date === "") {
    return "";
  }

  let d: dayjs.Dayjs | null = null;

  if (typeof date === "string") {
    let cleanStr = date.trim();

    if (timeStr && timeStr.trim()) {
      const cleanTime = timeStr.trim();
      if (!cleanStr.includes(" ") && !cleanStr.includes("T")) {
        cleanStr = `${cleanStr} ${cleanTime}`;
      }
    }

    // Attempt parsing with explicit common formats
    for (const fmt of COMMON_PARSE_FORMATS) {
      const parsed = dayjs(cleanStr, fmt, true);
      if (parsed.isValid()) {
        d = parsed;
        break;
      }
    }

    // Fallback to standard dayjs parsing if strict parsing didn't match
    if (!d) {
      const fallback = dayjs(cleanStr);
      if (fallback.isValid()) {
        d = fallback;
      }
    }
  } else {
    const parsed = dayjs(date);
    if (parsed.isValid()) {
      d = parsed;
    }
  }

  if (!d || !d.isValid()) {
    return "";
  }

  return d.format(formatStr);
}

export default formatDate;
