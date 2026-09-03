/**
 * Checks if the user's role is included in the allowed roles.
 */
export const checkUserType = (user: any, allowedRoles: string[]): boolean => {
  const userType = (user?.type || "").toLowerCase().trim();
  return allowedRoles.map((role) => role.toLowerCase().trim()).includes(userType);
};
