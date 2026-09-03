import { COLORS } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  getOrderStatusConfig,
  type IOrderStatusKey,
} from "./getOrderStatusConfig";

export type IStatusBadgeKey =
  | IOrderStatusKey
  | "complete"
  | "preparing"
  | "active"
  | "expired"
  | "inactive"
  | "accepted"
  | "delivered"
  | "paid"
  | "unpaid";

export interface IStatusBadgeConfig {
  key: IStatusBadgeKey;
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor: string;
  containerClass: string;
  textClass: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

const pendingOrderConfig = getOrderStatusConfig("pending");
const acceptedOrderConfig = getOrderStatusConfig("accepted");
const kitchenOrderConfig = getOrderStatusConfig("kitchen");
const readyOrderConfig = getOrderStatusConfig("ready");
const pickedUpOrderConfig = getOrderStatusConfig("picked_up");
const enRouteOrderConfig = getOrderStatusConfig("en_route");
const arrivedOrderConfig = getOrderStatusConfig("arrived");
const deliveredOrderConfig = getOrderStatusConfig("delivered");
const completedOrderConfig = getOrderStatusConfig("completed");
const cancelledOrderConfig = getOrderStatusConfig("cancelled");

const STATUS_BADGE_CONFIG: Record<string, IStatusBadgeConfig> = {
  pending: {
    key: "pending",
    iconName: pendingOrderConfig.iconName,
    iconColor: pendingOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${pendingOrderConfig.color}15`,
    borderColor: `${pendingOrderConfig.color}`,
    textColor: pendingOrderConfig.textColor,
  },
  kitchen: {
    key: "kitchen",
    iconName: kitchenOrderConfig.iconName,
    iconColor: kitchenOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${kitchenOrderConfig.color}15`,
    borderColor: `${kitchenOrderConfig.color}66`,
    textColor: kitchenOrderConfig.textColor,
  },
  preparing: {
    key: "preparing",
    iconName: kitchenOrderConfig.iconName,
    iconColor: kitchenOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${kitchenOrderConfig.color}15`,
    borderColor: `${kitchenOrderConfig.color}66`,
    textColor: kitchenOrderConfig.textColor,
  },
  ready: {
    key: "ready",
    iconName: readyOrderConfig.iconName,
    iconColor: readyOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${readyOrderConfig.color}15`,
    borderColor: `${readyOrderConfig.color}66`,
    textColor: readyOrderConfig.textColor,
  },
  picked_up: {
    key: "picked_up",
    iconName: pickedUpOrderConfig.iconName,
    iconColor: pickedUpOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${pickedUpOrderConfig.color}15`,
    borderColor: `${pickedUpOrderConfig.color}66`,
    textColor: pickedUpOrderConfig.textColor,
  },
  en_route: {
    key: "en_route",
    iconName: enRouteOrderConfig.iconName,
    iconColor: enRouteOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${enRouteOrderConfig.color}15`,
    borderColor: `${enRouteOrderConfig.color}66`,
    textColor: enRouteOrderConfig.textColor,
  },
  arrived: {
    key: "arrived",
    iconName: arrivedOrderConfig.iconName,
    iconColor: arrivedOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${arrivedOrderConfig.color}15`,
    borderColor: `${arrivedOrderConfig.color}66`,
    textColor: arrivedOrderConfig.textColor,
  },
  completed: {
    key: "completed",
    iconName: completedOrderConfig.iconName,
    iconColor: completedOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${completedOrderConfig.color}15`,
    borderColor: `${completedOrderConfig.color}66`,
    textColor: completedOrderConfig.textColor,
  },
  complete: {
    key: "complete",
    iconName: completedOrderConfig.iconName,
    iconColor: completedOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${completedOrderConfig.color}15`,
    borderColor: `${completedOrderConfig.color}66`,
    textColor: completedOrderConfig.textColor,
  },
  cancelled: {
    key: "cancelled",
    iconName: cancelledOrderConfig.iconName,
    iconColor: cancelledOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${cancelledOrderConfig.color}15`,
    borderColor: `${cancelledOrderConfig.color}66`,
    textColor: cancelledOrderConfig.textColor,
  },
  active: {
    key: "active",
    iconName: "check-circle",
    iconColor: COLORS.success,
    containerClass: "",
    textClass: "",
    backgroundColor: `${COLORS.success}15`,
    borderColor: `${COLORS.success}66`,
    textColor: COLORS.success,
  },
  expired: {
    key: "expired",
    iconName: "error-outline",
    iconColor: COLORS.error,
    containerClass: "",
    textClass: "",
    backgroundColor: `${COLORS.error}15`,
    borderColor: `${COLORS.error}66`,
    textColor: COLORS.error,
  },
  inactive: {
    key: "inactive",
    iconName: "pause-circle-outline",
    iconColor: COLORS.accent,
    containerClass: "",
    textClass: "",
    backgroundColor: `${COLORS.accent}15`,
    borderColor: `${COLORS.accent}66`,
    textColor: COLORS.accent,
  },
  accepted: {
    key: "accepted",
    iconName: acceptedOrderConfig.iconName,
    iconColor: acceptedOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${acceptedOrderConfig.color}15`,
    borderColor: `${acceptedOrderConfig.color}66`,
    textColor: acceptedOrderConfig.textColor,
  },
  delivered: {
    key: "delivered",
    iconName: deliveredOrderConfig.iconName,
    iconColor: deliveredOrderConfig.iconColor,
    containerClass: "",
    textClass: "",
    backgroundColor: `${deliveredOrderConfig.color}15`,
    borderColor: `${deliveredOrderConfig.color}66`,
    textColor: deliveredOrderConfig.textColor,
  },
  paid: {
    key: "paid",
    iconName: "check-circle",
    iconColor: COLORS.amount.paid,
    containerClass: "",
    textClass: "",
    backgroundColor: `${COLORS.amount.paid}15`,
    borderColor: `${COLORS.amount.paid}66`,
    textColor: COLORS.amount.paid,
  },
  unpaid: {
    key: "unpaid",
    iconName: "payment",
    iconColor: COLORS.amount.unpaid,
    containerClass: "",
    textClass: "",
    backgroundColor: `${COLORS.amount.unpaid}15`,
    borderColor: `${COLORS.amount.unpaid}66`,
    textColor: COLORS.amount.unpaid,
  },
};

const DEFAULT_STATUS_BADGE_CONFIG = {
  key: "unknown",
  iconName: "help-outline",
  iconColor: COLORS.accent,
  containerClass: "",
  textClass: "",
  backgroundColor: `${COLORS.accent}15`,
  borderColor: `${COLORS.accent}66`,
  textColor: COLORS.accent,
};

export function getStatusBadgeConfig(status: string): IStatusBadgeConfig {
  const normalizedKey = (status || "")
    .toLowerCase()
    .trim()
    .replaceAll(" ", "_");

  return STATUS_BADGE_CONFIG[normalizedKey] || DEFAULT_STATUS_BADGE_CONFIG;
}

export default getStatusBadgeConfig;
