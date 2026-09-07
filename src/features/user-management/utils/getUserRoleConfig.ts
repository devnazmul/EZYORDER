import { ROLE } from "@/constants";
import { COLORS } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

export type IUserRoleKey = ROLE.WAITER | ROLE.DRIVER;

export interface IUserRoleConfig {
  label: string;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const USER_ROLES_CONFIG: Record<IUserRoleKey, IUserRoleConfig> = {
  [ROLE.WAITER]: {
    label: "Waiter",
    color: COLORS.secondary,
    icon: "restaurant",
  },
  [ROLE.DRIVER]: {
    label: "Driver",
    color: COLORS.accent,
    icon: "directions-car",
  },
};

// Default fallback config for unknown roles
export const DEFAULT_USER_ROLE_CONFIG: IUserRoleConfig = {
  label: "Staff",
  color: COLORS.accent,
  icon: "person",
};

export function getUserRoleConfig(key?: string | null): IUserRoleConfig {
  const normalizedKey = (key || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_") as IUserRoleKey;

  return USER_ROLES_CONFIG[normalizedKey] || DEFAULT_USER_ROLE_CONFIG;
}

export default getUserRoleConfig;
