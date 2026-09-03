import { ALLOWED_ROLES, ROLE } from "@/constants";

export const verifUserRole = (role: ROLE) => {
  return ALLOWED_ROLES?.includes(role);
};
