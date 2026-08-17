import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface AreaBadgeProps {
  area?: string;
  iconColor?: string;
  textClassName?: string;
}

const getAreaIcon = (area?: string): keyof typeof MaterialIcons.glyphMap => {
  const a = (area || "").toLowerCase().trim();
  if (a.includes("indoor")) return "home";
  if (a.includes("outdoor")) return "deck";
  if (a.includes("rooftop")) return "roofing";
  return "place";
};

export default function AreaBadge({
  area,
  iconColor = "#DC2D2A", // primary color
  textClassName = "text-[11px] font-bold text-accent",
}: AreaBadgeProps) {
  const areaName = area || "General";
  const areaIcon = getAreaIcon(areaName);

  return (
    <View className="flex-row items-center gap-0.5">
      <MaterialIcons name={areaIcon} size={12} color={iconColor} />
      <Text className={textClassName}>{areaName}</Text>
    </View>
  );
}
