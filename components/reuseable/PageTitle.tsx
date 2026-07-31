import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface PageTitleProps {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badgeCount?: number;
  description?: string;
}

export default function PageTitle({ title, icon, badgeCount, description }: PageTitleProps) {
  return (
    <View className="flex-row items-start gap-3 mb-4">
      <View className="bg-primary/10 p-3 rounded-lg">
        <MaterialIcons name={icon} size={description ? WP("6%") : WP("5%")} color={COLORS.primary} />
      </View>
      <View className="">
        <View className="flex-row items-center gap-2">
          <Text
            style={{ fontSize: getResponsiveFontSize("lg") }}
            className="font-bold text-neutral capitalize "
          >
            {title}
          </Text>
          {badgeCount !== undefined && badgeCount > 0 && (
            <View className="bg-primary px-2.5 py-0.5 rounded-lg items-center justify-center">
              <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-white font-bold">
                {badgeCount}
              </Text>
            </View>
          )}
        </View>
        {description !== undefined && description && (
          <Text numberOfLines={2} style={{ fontSize: getResponsiveFontSize("sm") }} className="text-accent">
            {description}
          </Text>
        )}
      </View>
    </View>
  );
}
