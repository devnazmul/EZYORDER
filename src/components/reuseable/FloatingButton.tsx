import { COLORS } from "@/constants/colors";
import { WP } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

export type IFloatingButtonPosition =
  "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface IFloatingButtonProps {
  readonly icon?: keyof typeof MaterialIcons.glyphMap;
  readonly position?: IFloatingButtonPosition;
  readonly onPress: () => void;
  readonly size?: number;
  readonly backgroundColor?: string;
  readonly iconColor?: string;
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly className?: string;
}

export default function FloatingButton({
  icon = "add",
  position = "bottom-right",
  onPress,
  size = WP("12%"),
  backgroundColor = COLORS.primary,
  iconColor = COLORS.base300,
  accessibilityLabel = "Action button",
  style,
  className = "",
}: Readonly<IFloatingButtonProps>) {
  const iconSize = size * 0.58;

  const [vertical, horizontal] = (position || "bottom-right").split("-") as [
    "top" | "bottom",
    "left" | "right",
  ];

  const positionStyles: ViewStyle = {
    position: "absolute",
    zIndex: 50,
    [vertical]: 15,
    [horizontal]: 10,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        positionStyles,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          elevation: 6,
          shadowColor: backgroundColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
        },
        style,
      ]}
      className={`items-center justify-center ${className}`}
    >
      <MaterialIcons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
