import COLORS from "@/constants/colors";
import { getResponsiveFontSize } from "@/utils/getResponsiveSizes";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  isLoading?: boolean;
  containerClassName?: string;
  containerStyle?: object | null;
  buttonClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  isLoading = false,
  containerClassName = "",
  containerStyle = {},
  buttonClassName = "",
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const isPressable = !disabled && !isLoading;

  let btnClass = "w-full py-3 rounded-lg flex-row items-center justify-center gap-2";
  let txtClass = "font-bold";

  // Only apply shadow-sm when button is pressable (opacity is not low)
  if (isPressable) {
    btnClass += " shadow-sm";
  }

  if (variant === "primary") {
    btnClass += isPressable ? " bg-primary" : " bg-primary/50";
    txtClass += " text-white";
  } else if (variant === "secondary") {
    btnClass += isPressable
      ? " bg-base-300 border border-base-200"
      : " bg-base-300/50 border border-base-200/50";
    txtClass += " text-neutral";
  } else if (variant === "outline") {
    btnClass += isPressable
      ? " bg-transparent border border-primary"
      : " bg-transparent border border-primary/50";
    txtClass += " text-primary";
  }

  return (
    <Pressable
      onPress={isPressable ? onPress : undefined}
      disabled={!isPressable}
      className={`${btnClass} ${containerClassName}`}
      style={containerStyle}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? COLORS.base300 : COLORS.primary} />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text
            numberOfLines={1}
            className={`${txtClass} ${buttonClassName} !bg-transparent`}
            style={{ fontSize: getResponsiveFontSize("xs") + 1 }}
          >
            {label}
          </Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </Pressable>
  );
}
