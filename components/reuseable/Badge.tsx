import React from "react";
import { Text, View } from "react-native";

interface BadgeProps {
  text: string;
  containerClassName?: string;
  textClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Badge({
  text,
  containerClassName = "",
  textClassName = "",
  icon,
  iconPosition = "left",
}: BadgeProps) {
  return (
    <View className={`flex-row items-center gap-1 px-2.5 py-0.5 rounded-full ${containerClassName}`}>
      {icon && iconPosition === "left" && icon}
      <Text className={`text-[10px] font-bold capitalize tracking-wider ${textClassName}`}>
        {text}
      </Text>
      {icon && iconPosition === "right" && icon}
    </View>
  );
}
