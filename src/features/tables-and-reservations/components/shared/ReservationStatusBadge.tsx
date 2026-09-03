import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface ReservationStatusBadgeProps {
  status?: string;
}

const STATUS_CONFIG: Record<
  string,
  {
    bgClass: string;
    textClass: string;
    label: string;
    iconName: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
  }
> = {
  pending: {
    bgClass: "bg-warning/15 border-warning/30",
    textClass: "text-warning",
    label: "Pending",
    iconName: "schedule",
    iconColor: "#FFDB67",
  },
  accepted: {
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success",
    label: "Confirmed",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  approved: {
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success",
    label: "Confirmed",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  declined: {
    bgClass: "bg-error/15 border-error/30",
    textClass: "text-error",
    label: "Declined",
    iconName: "cancel",
    iconColor: "#ff8369",
  },
  rejected: {
    bgClass: "bg-error/15 border-error/30",
    textClass: "text-error",
    label: "Declined",
    iconName: "cancel",
    iconColor: "#ff8369",
  },
  cancelled: {
    bgClass: "bg-accent/15 border-accent/30",
    textClass: "text-accent/80",
    label: "Cancelled",
    iconName: "block",
    iconColor: "#6E6E6E",
  },
  seated: {
    bgClass: "bg-info/15 border-info/30",
    textClass: "text-info",
    label: "Seated",
    iconName: "event-seat",
    iconColor: "#5881ff",
  },
};

export default function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const statusKey = (status || "").toLowerCase().trim();
  const cfg = STATUS_CONFIG[statusKey] || {
    bgClass: "bg-accent/15 border-accent/30",
    textClass: "text-accent",
    label: status || "Unknown",
    iconName: "help-outline" as keyof typeof MaterialIcons.glyphMap,
    iconColor: "#6E6E6E",
  };

  return (
    <View className={`flex-row items-center px-2.5 py-1 rounded-full border ${cfg.bgClass}`}>
      <MaterialIcons name={cfg.iconName} size={10} color={cfg.iconColor} style={{ marginRight: 4 }} />
      <Text className={`text-[10px] font-bold ${cfg.textClass}`}>{cfg.label}</Text>
    </View>
  );
}
