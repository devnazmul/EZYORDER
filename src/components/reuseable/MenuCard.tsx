import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MenuCardProps {
  title: string;
  description: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  containerClassName?: string;
}

export default function MenuCard({
  title,
  description,
  iconName,
  onPress,
  containerClassName = "",
}: MenuCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ padding: WP("3.5%") }}
      className={`flex-row items-center bg-base-300 rounded-lg border border-base-200 shadow-sm ${containerClassName}`}
    >
      {/* Icon Circular Wrapper */}
      <View
        style={{ width: WP("10%"), height: WP("10%"), marginRight: WP("3%") }}
        className="rounded-lg bg-primary/10 items-center justify-center"
      >
        <MaterialIcons name={iconName} size={WP("6%")} color={COLORS.primary} />
      </View>

      {/* Text Information */}
      <View className="flex-1">
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="font-bold text-neutral mb-0.5 capitalize"
        >
          {title}
        </Text>
        <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="text-accent">
          {description}
        </Text>
      </View>

      {/* Chevron Right indicator */}
      <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
    </TouchableOpacity>
  );
}
