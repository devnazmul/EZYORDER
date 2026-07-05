import React from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = (status || "").toLowerCase().trim();

  let containerClass = "flex-row items-center px-2.5 py-1 rounded-full border bg-neutral/5 border-neutral/10";
  let textClass = "text-[10px] font-bold text-neutral";
  let iconName: React.ComponentProps<typeof MaterialIcons>["name"] = "help-outline";
  let iconColor = "#404040";
  let label = status || "Unknown";

  if (s === "new" || s === "pending") {
    containerClass = "flex-row items-center px-2.5 py-1 rounded-full border bg-blue-50 border-blue-100";
    textClass = "text-[10px] font-bold text-blue-700";
    iconName = "fiber-new";
    iconColor = "#1D4ED8";
    label = "New";
  } else if (s === "kitchen" || s === "preparing") {
    containerClass = "flex-row items-center px-2.5 py-1 rounded-full border bg-orange-50 border-orange-100";
    textClass = "text-[10px] font-bold text-orange-700";
    iconName = "restaurant";
    iconColor = "#C2410C";
    label = "Preparing";
  } else if (s === "completed" || s === "complete") {
    containerClass = "flex-row items-center px-2.5 py-1 rounded-full border bg-green-50 border-green-100";
    textClass = "text-[10px] font-bold text-green-700";
    iconName = "check-circle";
    iconColor = "#15803D";
    label = "Completed";
  } else if (s === "unpaid") {
    containerClass = "flex-row items-center px-2.5 py-1 rounded-full border bg-pink-50 border-pink-100";
    textClass = "text-[10px] font-bold text-pink-700";
    iconName = "payment";
    iconColor = "#B70E5C";
    label = "Unpaid";
  }

  return (
    <View className={containerClass}>
      <MaterialIcons
        name={iconName}
        size={12}
        color={iconColor}
        style={{ marginRight: 4 }}
      />
      <Text className={textClass}>{label}</Text>
    </View>
  );
}
