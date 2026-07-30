import COLORS from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export interface StatusBadgeConfig {
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor: string;
  containerClass: string;
  textClass: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export const getStatusBadgeConfig = (status: string): StatusBadgeConfig => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "pending":
      return {
        iconName: "schedule",
        iconColor: COLORS.warning,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.warning}15`,
        borderColor: `${COLORS.warning}`,
        textColor: COLORS.warning,
      };
    case "completed":
    case "complete":
      return {
        iconName: "check-circle",
        iconColor: COLORS.success,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.success}15`,
        borderColor: `${COLORS.success}66`,
        textColor: COLORS.success,
      };
    case "kitchen":
    case "preparing":
      return {
        iconName: "restaurant",
        iconColor: COLORS.secondary,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.secondary}15`,
        borderColor: `${COLORS.secondary}66`,
        textColor: COLORS.secondary,
      };
    case "active":
      return {
        iconName: "check-circle",
        iconColor: COLORS.success,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.success}15`,
        borderColor: `${COLORS.success}66`,
        textColor: COLORS.success,
      };
    case "expired":
      return {
        iconName: "error-outline",
        iconColor: COLORS.error,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.error}15`,
        borderColor: `${COLORS.error}66`,
        textColor: COLORS.error,
      };
    case "inactive":
      return {
        iconName: "pause-circle-outline",
        iconColor: COLORS.accent,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.accent}15`,
        borderColor: `${COLORS.accent}66`,
        textColor: COLORS.accent,
      };
    case "accepted":
      return {
        iconName: "thumb-up",
        iconColor: COLORS.info,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.info}15`,
        borderColor: `${COLORS.info}66`,
        textColor: COLORS.info,
      };
    case "delivered":
      return {
        iconName: "local-shipping",
        iconColor: COLORS.info,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.info}15`,
        borderColor: `${COLORS.info}66`,
        textColor: COLORS.info,
      };
    case "paid":
      return {
        iconName: "check-circle",
        iconColor: COLORS.success,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.success}15`,
        borderColor: `${COLORS.success}66`,
        textColor: COLORS.success,
      };
    case "unpaid":
      return {
        iconName: "payment",
        iconColor: COLORS.primary,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.primary}15`,
        borderColor: `${COLORS.primary}66`,
        textColor: COLORS.primary,
      };
    default:
      return {
        iconName: "help-outline",
        iconColor: COLORS.accent,
        containerClass: "",
        textClass: "",
        backgroundColor: `${COLORS.accent}15`,
        borderColor: `${COLORS.accent}66`,
        textColor: COLORS.accent,
      };
  }
};
