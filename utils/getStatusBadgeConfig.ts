import COLORS from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export interface StatusBadgeConfig {
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor: string;
  containerClass: string;
  textClass: string;
}

export const getStatusBadgeConfig = (status: string): StatusBadgeConfig => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "pending":
      return {
        iconName: "schedule",
        iconColor: "#EA580C",
        containerClass: "bg-orange-50 border border-orange-100",
        textClass: "text-orange-700",
      };
    case "completed":
    case "complete":
      return {
        iconName: "check-circle",
        iconColor: "#15803D",
        containerClass: "bg-green-50 border border-green-100",
        textClass: "text-green-700",
      };
    case "kitchen":
    case "preparing":
      return {
        iconName: "restaurant",
        iconColor: "#D97706",
        containerClass: "bg-warning/10 border border-warning/30",
        textClass: "text-amber-700",
      };
    case "active":
      return {
        iconName: "check-circle",
        iconColor: "#15803D",
        containerClass: "bg-green-50 border border-green-100",
        textClass: "text-green-700",
      };
    case "expired":
      return {
        iconName: "error-outline",
        iconColor: COLORS.error,
        containerClass: "bg-error/10 border border-error/30",
        textClass: "text-error",
      };
    case "inactive":
      return {
        iconName: "pause-circle-outline",
        iconColor: "#6E6E6E",
        containerClass: "bg-neutral/5 border border-neutral/20",
        textClass: "text-accent",
      };
    case "accepted":
      return {
        iconName: "thumb-up",
        iconColor: "#2563EB",
        containerClass: "bg-blue-50 border border-blue-100",
        textClass: "text-blue-700",
      };
    case "delivered":
      return {
        iconName: "local-shipping",
        iconColor: "#2563EB",
        containerClass: "bg-blue-50 border border-blue-100",
        textClass: "text-blue-700",
      };
    case "paid":
      return {
        iconName: "check-circle",
        iconColor: "#15803D",
        containerClass: "bg-green-50 border border-green-100",
        textClass: "text-green-700",
      };
    case "unpaid":
      return {
        iconName: "payment",
        iconColor: "#B70E5C",
        containerClass: "bg-pink-50 border border-pink-100",
        textClass: "text-pink-700",
      };
    default:
      return {
        iconName: "help-outline",
        iconColor: "#6E6E6E",
        containerClass: "bg-neutral/5 border border-neutral/10",
        textClass: "text-neutral",
      };
  }
};
