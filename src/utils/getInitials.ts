/**
 * Extracts initials from a full name string.
 * e.g. "John Doe" → "JD", "Fusion Desserts" → "FD", "Alice" → "AL", undefined → "??"
 */
export function getInitials(name?: string): string {
  if (!name?.trim()) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts.at(-1)?.[0]).toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}

export default getInitials;
