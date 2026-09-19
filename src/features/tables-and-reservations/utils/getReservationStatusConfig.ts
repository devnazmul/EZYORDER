// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 6. Types
import type { ReservationStatus } from "../types/reservation.types";

export interface IReservationStatusConfig {
  key: ReservationStatus;
  label: string;
  bgClass: string;
  textClass: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
}

const RESERVATION_STATUS_CONFIG: Record<string, IReservationStatusConfig> = {
  pending: {
    key: "pending",
    label: "Pending",
    bgClass: "bg-warning/15 border-warning/30",
    textClass: "text-warning",
    iconName: "schedule",
    iconColor: "#FFDB67",
  },
  accepted: {
    key: "accepted",
    label: "Confirmed",
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  approved: {
    key: "accepted",
    label: "Confirmed",
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  booked: {
    key: "accepted",
    label: "Confirmed",
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  declined: {
    key: "declined",
    label: "Declined",
    bgClass: "bg-error/15 border-error/30",
    textClass: "text-error",
    iconName: "cancel",
    iconColor: "#ff8369",
  },
  rejected: {
    key: "declined",
    label: "Declined",
    bgClass: "bg-error/15 border-error/30",
    textClass: "text-error",
    iconName: "cancel",
    iconColor: "#ff8369",
  },
  cancelled: {
    key: "cancelled",
    label: "Cancelled",
    bgClass: "bg-accent/15 border-accent/30",
    textClass: "text-accent/80",
    iconName: "block",
    iconColor: "#6E6E6E",
  },
};

const DEFAULT_RESERVATION_STATUS_CONFIG: IReservationStatusConfig = {
  key: "unknown" as ReservationStatus,
  label: "Unknown",
  bgClass: "bg-accent/15 border-accent/30",
  textClass: "text-accent",
  iconName: "help-outline",
  iconColor: "#6E6E6E",
};

export function getReservationStatusConfig(
  status?: ReservationStatus,
): IReservationStatusConfig {
  const normalizedKey = (status || "").toLowerCase().trim();
  return (
    RESERVATION_STATUS_CONFIG[normalizedKey] ||
    DEFAULT_RESERVATION_STATUS_CONFIG
  );
}

export default getReservationStatusConfig;
