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
    <View className="flex-row items-start gap-2 mb-4">
      <View className="bg-primary-container/10 p-1.5 rounded-lg">
        <MaterialIcons name={icon} size={description ? 24 : 18} color="#DC2D2A" />
      </View>
      <View className="">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-neutral capitalize tracking-tight">{title}</Text>
          {badgeCount !== undefined && badgeCount > 0 && (
            <View className="bg-primary px-2.5 py-0.5 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-bold">{badgeCount}</Text>
            </View>
          )}
        </View>
        {description !== undefined && description && (
          <Text className="text-xs text-accent">{description}</Text>
        )}
      </View>
    </View>
  );
}
