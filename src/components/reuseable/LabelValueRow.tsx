import { COLORS } from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

export interface ILabelValueRowProps {
  label: string;
  value: string | number;
  valueType?: "currency" | "text";
  currencySymbol?: string;

  // Icon props
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  iconClassName?: string;
  iconContainerStyle?: StyleProp<ViewStyle>;

  // Label props
  labelColor?: string;
  labelClassName?: string;
  labelStyle?: StyleProp<TextStyle>;

  // Value props
  valueColor?: string;
  valueClassName?: string;
  valueStyle?: StyleProp<TextStyle>;

  // Container props
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function LabelValueRow({
  label,
  value,
  valueType = "text",
  currencySymbol = "£",
  icon,
  iconColor = COLORS.primary,
  iconSize,
  iconClassName = "",
  iconContainerStyle,
  labelColor,
  labelClassName = "font-semibold text-neutral",
  labelStyle,
  valueColor,
  valueClassName = "font-semibold",
  valueStyle,
  containerClassName = "flex-row justify-between items-center",
  containerStyle,
}: Readonly<ILabelValueRowProps>) {
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  const isNumeric = !Number.isNaN(numericValue);

  // Determine formatted display string
  let displayValue: string;
  if (valueType === "currency" && isNumeric) {
    displayValue = formatAmount(numericValue, currencySymbol);
  } else {
    displayValue = String(value ?? "");
  }

  // Determine value color
  let resolvedValueColor = valueColor;
  if (!resolvedValueColor) {
    if (valueType === "currency" && isNumeric) {
      resolvedValueColor =
        numericValue < 0 ? COLORS.error || "#EF4444" : COLORS.neutral;
    } else {
      resolvedValueColor = COLORS.neutral;
    }
  }

  const resolvedIconSize = iconSize ?? WP("4.5%");

  return (
    <View className={containerClassName} style={containerStyle}>
      {/* Left side: Icon + Label */}
      <View
        className="flex-row gap-2 items-center flex-1 pr-2"
        style={iconContainerStyle}
      >
        {icon ? (
          <MaterialIcons
            name={icon}
            size={resolvedIconSize}
            color={iconColor}
            className={iconClassName}
          />
        ) : null}
        <Text
          style={[
            { fontSize: getResponsiveFontSize("sm") },
            labelColor ? { color: labelColor } : undefined,
            labelStyle,
          ]}
          className={`flex-1 flex-wrap capitalize ${labelClassName}`}
        >
          {label}
        </Text>
      </View>

      {/* Right side: Formatted Value */}
      <Text
        style={[
          { fontSize: getResponsiveFontSize("sm") },
          resolvedValueColor ? { color: resolvedValueColor } : undefined,
          valueStyle,
        ]}
        className={valueClassName}
      >
        {displayValue}
      </Text>
    </View>
  );
}
