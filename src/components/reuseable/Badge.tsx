// 1. React / React Native
import React from "react";
import {
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import CustomText from "./CustomText";

export interface IBadgeProps {
  text: string;
  containerClassName?: string;
  textClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  iconPosition?: "left" | "right";
}

export default function Badge({
  text,
  containerClassName = "",
  textClassName = "",
  containerStyle,
  textStyle,
  icon,
  iconName,
  iconSize = 10,
  iconColor,
  iconPosition = "left",
}: Readonly<IBadgeProps>) {
  const renderedIcon =
    icon ??
    (iconName ? (
      <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
    ) : null);

  return (
    <View
      className={`flex-row items-center gap-1 px-2.5 py-0.5 rounded-full ${containerClassName}`.trim()}
      style={containerStyle}
    >
      {renderedIcon && iconPosition === "left" && renderedIcon}
      <CustomText
        size="xs"
        weight="bold"
        style={textStyle}
        className={`capitalize tracking-wider ${textClassName}`.trim()}
      >
        {text}
      </CustomText>
      {renderedIcon && iconPosition === "right" && renderedIcon}
    </View>
  );
}
