// 1. React / React Native
import React from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import Button from "./Button";

// 7. Constants / utils
import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export interface IErrorStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  onRetry?: () => void;
  retryLabel?: string;
  pyClassName?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "Failed to load data. Please try again.",
  icon = "error-outline",
  onRetry,
  retryLabel = "Try Again",
  pyClassName = "py-8",
}: Readonly<IErrorStateProps>) {
  return (
    <View className={`items-center justify-center ${pyClassName} px-4`}>
      <View className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mb-3">
        <MaterialIcons name={icon} size={WP("5%")} color={COLORS.error} />
      </View>
      <Text
        style={{ fontSize: getResponsiveFontSize("sm") }}
        className="font-bold text-neutral mb-1 text-center"
      >
        {title}
      </Text>
      <Text
        style={{ fontSize: getResponsiveFontSize("xs") }}
        className="text-accent text-center leading-4 max-w-[280px] mb-3"
      >
        {message}
      </Text>
      {onRetry && (
        <Button label={retryLabel} onPress={onRetry} variant="outline" />
      )}
    </View>
  );
}
