import { getResponsiveFontSize } from "@/utils/getResponsiveSizes";
import React from "react";
import { Text } from "react-native";

export interface IInputErrorProps {
  readonly errorMessage?: string;
  readonly className?: string;
}

export default function InputError({
  errorMessage,
  className,
}: IInputErrorProps) {
  if (!errorMessage) return null;

  return (
    <Text
      style={{ fontSize: getResponsiveFontSize("sm") - 2 }}
      className={`text-error font-medium mt-1 ml-1 ${className || ""}`}
    >
      {errorMessage}
    </Text>
  );
}
