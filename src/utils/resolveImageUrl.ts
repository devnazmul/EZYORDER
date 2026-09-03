import { ENV } from "@/config/env";

/**
 * Resolves a full, absolute image URL for relative asset paths.
 */
export const resolveImageUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const mediaBase = ENV.API_BASE_URL.replace("/api", "");
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${mediaBase}/${cleanPath}`;
};
