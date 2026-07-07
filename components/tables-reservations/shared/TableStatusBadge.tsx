import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface TableStatusBadgeProps {
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
  free: {
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success-content text-success",
    label: "Available",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  available: {
    bgClass: "bg-success/15 border-success/30",
    textClass: "text-success-content text-success",
    label: "Available",
    iconName: "check-circle",
    iconColor: "#36d399",
  },
  occupied: {
    bgClass: "bg-error/15 border-error/30",
    textClass: "text-error-content text-error",
    label: "Occupied",
    iconName: "cancel",
    iconColor: "#ff8369",
  },
  reserved: {
    bgClass: "bg-warning/15 border-warning/30",
    textClass: "text-warning-content text-warning",
    label: "Reserved",
    iconName: "event-seat",
    iconColor: "#FFDB67",
  },
};

export default function TableStatusBadge({ status }: TableStatusBadgeProps) {
  const statusKey = (status || "").toLowerCase().trim();
  const cfg = STATUS_CONFIG[statusKey] || {
    bgClass: "bg-accent/15 border-accent/30",
    textClass: "text-accent",
    label: status || "Unknown",
    iconName: "help-outline" as keyof typeof MaterialIcons.glyphMap,
    iconColor: "#6E6E6E",
  };

  return (
    <View className={`flex-row items-center px-2 py-0.5 rounded-full border ${cfg.bgClass}`}>
      <MaterialIcons
        name={cfg.iconName}
        size={10}
        color={cfg.iconColor}
        style={{ marginRight: 4 }}
      />
      <Text className={`text-[10px] font-bold ${cfg.textClass}`}>{cfg.label}</Text>
    </View>
  );
}
