import React from "react";
import { Text, View } from "react-native";

interface BadgeProps {
  text: string;
  containerClassName?: string;
  textClassName?: string;
}

export default function Badge({
  text,
  containerClassName = "",
  textClassName = "",
}: BadgeProps) {
  return (
    <View className={`px-2.5 py-0.5 rounded-full ${containerClassName}`}>
      <Text className={`text-[10px] font-bold capitalize tracking-wider ${textClassName}`}>
        {text}
      </Text>
    </View>
  );
}
