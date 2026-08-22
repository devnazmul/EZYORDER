import { getResponsiveFontSize } from "@/utils/getResponsiveSizes";
import React from "react";
import { Text } from "react-native";

export interface IInputLabelProps {
  readonly label?: string;
  readonly className?: string;
}

export default function InputLabel({ label, className }: IInputLabelProps) {
  if (!label) return null;

  return (
    <Text
      style={{ fontSize: getResponsiveFontSize("sm") - 1 }}
      className={`font-semibold text-accent ${className || ""}`}
    >
      {label}
    </Text>
  );
}
