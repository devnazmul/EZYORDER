import type { Href } from "expo-router";

import {
  ALLOWED_ROLES,
  AUTH_ROUTES,
  DRIVER_ROUTES,
  OWNER_ROUTES,
  ROLE,
} from "@/constants";

/**
 * Determines the target redirect route for an authenticated user based on their assigned role.
 *
 * @param roleName - Raw role string from user profile (e.g., "Owner", "Driver", "Admin").
 * @returns The target route (`Href`) for authorized role dashboards (`OWNER_ROUTES.HOME`, `DRIVER_ROUTES.DASHBOARD`),
 *          or falls back to `AUTH_ROUTES.UNAUTHORIZED` if the role is missing or unauthorized.
 */
export function getRoleRedirectRoute(roleName?: string | null): Href {
  const role = (roleName || "").toLowerCase().trim() as ROLE;
  const isAllowed = ALLOWED_ROLES.includes(role);

  if (!isAllowed) {
    return AUTH_ROUTES.UNAUTHORIZED;
  }
  if (role === ROLE.DRIVER) {
    return DRIVER_ROUTES.DASHBOARD;
  }
  if (role === ROLE.OWNER) {
    return OWNER_ROUTES.HOME;
  }
  return AUTH_ROUTES.UNAUTHORIZED;
}

export default getRoleRedirectRoute;
