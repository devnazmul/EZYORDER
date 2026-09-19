// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 6. Types
import type { TableStatus } from "../types/table.types";

export interface ITableStatusConfig {
  key: TableStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  circleBg: string;
  bgClass: string;
  textClass: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
}

const TABLE_STATUS_CONFIG: Record<string, ITableStatusConfig> = {
  occupied: {
    key: "occupied",
    label: "Occupied",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-600",
    circleBg: "bg-rose-50",
    bgClass: "bg-error/15 border-error/30",
    textClass: "text-error-content text-error",
    iconName: "cancel",
    iconColor: "#ff8369",
  },
  free: {
    key: "free",
    label: "Available",
    badgeBg: "bg-green-100",
    badgeText: "text-green-600",
    circleBg: "bg-green-50",
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success-content text-success",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  available: {
    key: "available",
    label: "Available",
    badgeBg: "bg-green-100",
    badgeText: "text-green-600",
    circleBg: "bg-green-50",
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success-content text-success",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  reserved: {
    key: "reserved",
    label: "Reserved",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
    circleBg: "bg-blue-50",
    bgClass: "bg-warning/15 border-warning/30",
    textClass: "text-warning-content text-warning",
    iconName: "event-seat",
    iconColor: "#FFDB67",
  },
};

const DEFAULT_TABLE_STATUS_CONFIG: ITableStatusConfig = {
  key: "unknown" as TableStatus,
  label: "Available",
  badgeBg: "bg-green-100",
  badgeText: "text-green-600",
  circleBg: "bg-green-50",
  bgClass: "bg-accent/15 border-accent/30",
  textClass: "text-accent",
  iconName: "help-outline",
  iconColor: "#6E6E6E",
};

export function getTableStatusConfig(status?: TableStatus): ITableStatusConfig {
  const normalizedKey = (status || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_");
  return TABLE_STATUS_CONFIG[normalizedKey] || DEFAULT_TABLE_STATUS_CONFIG;
}

export default getTableStatusConfig;
