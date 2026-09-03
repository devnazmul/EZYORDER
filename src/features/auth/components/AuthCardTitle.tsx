import { getResponsiveFontSize } from "@/utils/getResponsiveSizes";
import React from "react";
import { Text, View } from "react-native";

export interface IAuthCardTitleProps {
  readonly title: string;
  readonly subtitle: string;
}

export function AuthCardTitle({
  title,
  subtitle,
}: Readonly<IAuthCardTitleProps>) {
  return (
    <View className="mb-4">
      <Text
        style={{ fontSize: getResponsiveFontSize("xl") }}
        className="font-bold text-neutral"
      >
        {title}
      </Text>
      <Text
        style={{ fontSize: getResponsiveFontSize("sm") }}
        className="text-accent font-medium mt-1"
      >
        {subtitle}
      </Text>
    </View>
  );
}
