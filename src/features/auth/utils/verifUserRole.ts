import { ROLE, ROLES } from "@/constants";

export const verifUserRole = (role: ROLE) => {
  return ROLES?.includes(role);
};
