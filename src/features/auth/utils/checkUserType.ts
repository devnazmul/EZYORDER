import { ROLE } from "@/constants";
import { IUser } from "@/features/user-management/types";

/**
 * Checks if the user's role is included in the allowed roles.
 */
export const checkUserType = (user: IUser, allowedRoles: ROLE[]): boolean => {
  const userType = (user?.role?.name || user?.type || "").toLowerCase().trim();
  return allowedRoles
    .map((role) => role.toLowerCase().trim())
    .includes(userType);
};
