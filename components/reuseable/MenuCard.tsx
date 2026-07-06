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
      className={`flex-row items-center p-5 bg-base-300 rounded-lg border border-base-200 shadow-sm ${containerClassName}`}
    >
      {/* Icon Circular Wrapper */}
      <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
        <MaterialIcons name={iconName} size={24} color="#DC2D2A" />
      </View>

      {/* Text Information */}
      <View className="flex-1">
        <Text className="text-md font-bold text-neutral mb-0.5">{title}</Text>
        <Text className="text-xs  text-accent  ">{description}</Text>
      </View>

      {/* Chevron Right indicator */}
      <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
    </TouchableOpacity>
  );
}
