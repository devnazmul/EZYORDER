import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface StatusBadgeProps {
  status: string;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor?: string;
  containerClassName?: string;
  textClassName?: string;
  label?: string;
}

export default function StatusBadge({
  status,
  icon,
  iconColor,
  containerClassName,
  textClassName,
  label,
}: StatusBadgeProps) {
  const s = (status || "").toLowerCase().trim();

  let resolvedContainerClass =
    "flex-row items-center px-2.5 py-1 rounded-full border bg-neutral/5 border-neutral/10";
  let resolvedTextClass = "text-[10px] font-bold text-neutral";
  let resolvedIconName: React.ComponentProps<typeof MaterialIcons>["name"] = "help-outline";
  let resolvedIconColor = "#404040";
  let resolvedLabel = label || status || "Unknown";

  if (s === "new" || s === "pending") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-orange-50 border-orange-100";
    resolvedTextClass = "text-[10px] font-bold text-orange-700";
    resolvedIconName = "fiber-new";
    resolvedIconColor = "#EA580C";
    resolvedLabel = label || (s === "pending" ? "Pending" : "New");
  } else if (s === "kitchen" || s === "preparing") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-orange-50 border-orange-100";
    resolvedTextClass = "text-[10px] font-bold text-orange-700";
    resolvedIconName = "restaurant";
    resolvedIconColor = "#EA580C";
    resolvedLabel = label || (s === "kitchen" ? "Kitchen" : "Preparing");
  } else if (s === "completed" || s === "complete") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-green-50 border-green-100";
    resolvedTextClass = "text-[10px] font-bold text-green-700";
    resolvedIconName = "check-circle";
    resolvedIconColor = "#15803D";
    resolvedLabel = label || "Completed";
  } else if (s === "accepted") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-orange-50 border-orange-100";
    resolvedTextClass = "text-[10px] font-bold text-orange-700";
    resolvedIconName = "thumb-up";
    resolvedIconColor = "#EA580C";
    resolvedLabel = label || "Accepted";
  } else if (s === "delivered") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-orange-50 border-orange-100";
    resolvedTextClass = "text-[10px] font-bold text-orange-700";
    resolvedIconName = "local-shipping";
    resolvedIconColor = "#EA580C";
    resolvedLabel = label || "Delivered";
  } else if (s === "paid") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-green-50 border-green-100";
    resolvedTextClass = "text-[10px] font-bold text-green-700";
    resolvedIconName = "check-circle";
    resolvedIconColor = "#15803D";
    resolvedLabel = label || "Paid";
  } else if (s === "unpaid") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-pink-50 border-pink-100";
    resolvedTextClass = "text-[10px] font-bold text-pink-700";
    resolvedIconName = "payment";
    resolvedIconColor = "#B70E5C";
    resolvedLabel = label || "Unpaid";
  } else if (s === "active") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-green-50 border-green-100";
    resolvedTextClass = "text-[10px] font-bold text-green-700";
    resolvedIconName = "check-circle";
    resolvedIconColor = "#15803D";
    resolvedLabel = label || "Active";
  } else if (s === "expired") {
    resolvedContainerClass = "flex-row items-center px-2.5 py-1 rounded-full border bg-red-50 border-red-100";
    resolvedTextClass = "text-[10px] font-bold text-red-700";
    resolvedIconName = "error-outline";
    resolvedIconColor = "#B91C1C";
    resolvedLabel = label || "Expired";
  } else if (s === "inactive") {
    resolvedContainerClass =
      "flex-row items-center px-2.5 py-1 rounded-full border bg-neutral/5 border-neutral/10";
    resolvedTextClass = "text-[10px] font-bold text-neutral/50";
    resolvedIconName = "pause-circle-outline";
    resolvedIconColor = "#A3A3A3";
    resolvedLabel = label || "Inactive";
  }

  // Apply custom prop overrides if provided
  if (icon) resolvedIconName = icon;
  if (iconColor) resolvedIconColor = iconColor;
  if (containerClassName) resolvedContainerClass = containerClassName;
  if (textClassName) resolvedTextClass = textClassName;

  return (
    <View className={resolvedContainerClass}>
      <MaterialIcons name={resolvedIconName} size={12} color={resolvedIconColor} style={{ marginRight: 4 }} />
      <Text className={resolvedTextClass}>{resolvedLabel}</Text>
    </View>
  );
}
