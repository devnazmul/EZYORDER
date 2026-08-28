import { COLORS } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export type IOrderStatusKey =
  | "pending"
  | "kitchen"
  | "ready"
  | "picked_up"
  | "en_route"
  | "arrived"
  | "completed"
  | "cancelled";

export interface IOrderStatusConfig {
  key: IOrderStatusKey;
  label: string;
  color: string;
  textColor: string;
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor: string;
}

const ORDER_STATUS_CONFIG: Record<string, IOrderStatusConfig> = {
  pending: {
    key: "pending",
    label: "Pending",
    color: COLORS.orderStatus.pending,
    textColor: COLORS.orderStatus.pending,
    iconName: "schedule",
    iconColor: COLORS.orderStatus.pending,
  },
  kitchen: {
    key: "kitchen",
    label: "Kitchen",
    color: COLORS.orderStatus.kitchen,
    textColor: COLORS.orderStatus.kitchen,
    iconName: "restaurant",
    iconColor: COLORS.orderStatus.kitchen,
  },
  ready: {
    key: "ready",
    label: "Ready",
    color: COLORS.orderStatus.ready,
    textColor: COLORS.orderStatus.ready,
    iconName: "thumb-up",
    iconColor: COLORS.orderStatus.ready,
  },
  picked_up: {
    key: "picked_up",
    label: "Picked Up",
    color: COLORS.orderStatus.picked_up,
    textColor: COLORS.orderStatus.picked_up,
    iconName: "local-shipping",
    iconColor: COLORS.orderStatus.picked_up,
  },
  en_route: {
    key: "en_route",
    label: "En Route",
    color: COLORS.orderStatus.en_route,
    textColor: COLORS.orderStatus.en_route,
    iconName: "local-shipping",
    iconColor: COLORS.orderStatus.en_route,
  },
  arrived: {
    key: "arrived",
    label: "Arrived",
    color: COLORS.orderStatus.arrived,
    textColor: COLORS.orderStatus.arrived,
    iconName: "place",
    iconColor: COLORS.orderStatus.arrived,
  },
  completed: {
    key: "completed",
    label: "Completed",
    color: COLORS.orderStatus.completed,
    textColor: COLORS.orderStatus.completed,
    iconName: "check-circle",
    iconColor: COLORS.orderStatus.completed,
  },
  cancelled: {
    key: "cancelled",
    label: "Cancelled",
    color: COLORS.orderStatus.cancelled,
    textColor: COLORS.orderStatus.cancelled,
    iconName: "error-outline",
    iconColor: COLORS.orderStatus.cancelled,
  },
};

const DEFAULT_ORDER_STATUS_CONFIG = {
  key: "unknown",
  label: "Unknown",
  color: COLORS.accent,
  textColor: COLORS.accent,
  iconName: "help-outline",
  iconColor: COLORS.accent,
};

export function getOrderStatusConfig(key: string): IOrderStatusConfig {
  const normalizedKey = (key || "").toLowerCase().trim().replaceAll(" ", "_");

  return ORDER_STATUS_CONFIG[normalizedKey] || DEFAULT_ORDER_STATUS_CONFIG;
}

export default getOrderStatusConfig;
