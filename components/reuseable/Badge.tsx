import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

interface BadgeProps {
  text: string;
  containerClassName?: string;
  textClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Badge({
  text,
  containerClassName = "",
  textClassName = "",
  containerStyle,
  textStyle,
  icon,
  iconPosition = "left",
}: BadgeProps) {
  return (
    <View
      className={`flex-row items-center gap-1 px-2.5 py-0.5 rounded-full ${containerClassName}`}
      style={containerStyle}
    >
      {icon && iconPosition === "left" && icon}
      <Text
        className={`text-[10px] font-bold capitalize tracking-wider ${textClassName}`}
        style={textStyle}
      >
        {text}
      </Text>
      {icon && iconPosition === "right" && icon}
    </View>
  );
}
