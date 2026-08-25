export function toggleMultiSelectValue(
  current: string[],
  optionId: string,
): string[] {
  if (optionId === "all") {
    return ["all"];
  }

  let next = current.filter((x) => x !== "all");
  if (next.includes(optionId)) {
    next = next.filter((x) => x !== optionId);
  } else {
    next.push(optionId);
  }

  if (next.length === 0) {
    next = ["all"];
  }

  return next;
}
