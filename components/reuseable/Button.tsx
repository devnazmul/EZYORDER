import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  isLoading?: boolean;
  containerClassName?: string;
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
  buttonClassName = "",
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const isPressable = !disabled && !isLoading;

  let btnClass = "w-full py-3 rounded-lg flex-row items-center justify-center gap-2 shadow-sm";
  let txtClass = "font-bold text-xs";

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
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#FFFFFF" : "#DC2D2A"} />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text numberOfLines={1} className={`${txtClass} ${buttonClassName} !bg-transparent`}>
            {label}
          </Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </Pressable>
  );
}
