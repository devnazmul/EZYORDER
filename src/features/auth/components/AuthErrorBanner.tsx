import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export interface IAuthErrorBannerProps {
  readonly message: string | null;
}

export function AuthErrorBanner({ message }: Readonly<IAuthErrorBannerProps>) {
  if (!message) return null;

  return (
    <View
      style={{ gap: WP("3%") }}
      className="flex-row items-center bg-error/15 border border-error/30 rounded-lg animate-pulse p-3 mb-4"
    >
      <MaterialIcons name="error" size={20} color="#DC2D2A" />
      <Text
        style={{ fontSize: getResponsiveFontSize("xs") }}
        className="flex-1 font-semibold text-primary leading-4"
      >
        {message}
      </Text>
    </View>
  );
}
