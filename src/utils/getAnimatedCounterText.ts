const NUMBER_MATCH_REGEX = /[\d,]+(?:\.\d+)?/;

/**
 * Parses and interpolates a number or formatted currency/value string
 * for smooth counter animations while preserving exact formatting (e.g. commas and decimals)
 *
 * @param value The target value string or number (e.g. "$1,250.50", "95%", 100)
 * @param progress A float from 0 to 1 representing current animation progress
 * @returns Interpolated string value formatted consistently with the original input
 */
export function getAnimatedCounterText(
  value: number | string,
  progress: number,
): string {
  if (progress >= 1) return String(value);

  if (typeof value === "number") {
    const current = value * progress;
    return Number.isInteger(value)
      ? Math.round(current).toString()
      : current.toFixed(2);
  }

  const match = NUMBER_MATCH_REGEX.exec(value);
  if (!match) {
    return value;
  }

  const matchedStr = match[0];
  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index + matchedStr.length);
  const hasCommas = matchedStr.includes(",");
  const numStr = matchedStr.replaceAll(",", "");
  const targetNum = Number.parseFloat(numStr);

  if (Number.isNaN(targetNum)) {
    return value;
  }

  const currentNum = targetNum * progress;
  const hasDecimals = matchedStr.includes(".");
  const decimalPlaces = hasDecimals
    ? (matchedStr.split(".")[1]?.length ?? 2)
    : 0;

  let formattedNum: string;
  if (hasCommas) {
    formattedNum = hasDecimals
      ? currentNum.toLocaleString("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        })
      : Math.round(currentNum).toLocaleString("en-US");
  } else {
    formattedNum = hasDecimals
      ? currentNum.toFixed(decimalPlaces)
      : Math.round(currentNum).toString();
  }

  return `${prefix}${formattedNum}${suffix}`;
}

export default getAnimatedCounterText;
