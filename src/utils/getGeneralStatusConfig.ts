import { COLORS } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export type IGeneralStatusKey = "active" | "inactive";

export interface IGeneralStatusConfig {
  key: IGeneralStatusKey | "unknown";
  label: string;
  color: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor: string;
}

const GENERAL_STATUS_CONFIG: Record<string, IGeneralStatusConfig> = {
  active: {
    key: "active",
    label: "Active",
    color: COLORS.success,
    textColor: COLORS.success,
    backgroundColor: `${COLORS.success}15`,
    borderColor: `${COLORS.success}66`,
    iconName: "check-circle",
    iconColor: COLORS.success,
  },
  inactive: {
    key: "inactive",
    label: "Inactive",
    color: COLORS.accent,
    textColor: COLORS.accent,
    backgroundColor: `${COLORS.accent}15`,
    borderColor: `${COLORS.accent}66`,
    iconName: "pause-circle-outline",
    iconColor: COLORS.accent,
  },
};

const DEFAULT_GENERAL_STATUS_CONFIG: IGeneralStatusConfig = {
  key: "unknown",
  label: "Unknown",
  color: COLORS.accent,
  textColor: COLORS.accent,
  backgroundColor: `${COLORS.accent}15`,
  borderColor: `${COLORS.accent}66`,
  iconName: "help-outline",
  iconColor: COLORS.accent,
};

export function getGeneralStatusConfig(key: string): IGeneralStatusConfig {
  const normalizedKey = (key || "").toLowerCase().trim().replaceAll(" ", "_");

  return GENERAL_STATUS_CONFIG[normalizedKey] || DEFAULT_GENERAL_STATUS_CONFIG;
}

export default getGeneralStatusConfig;
