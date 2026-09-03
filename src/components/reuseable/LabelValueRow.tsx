// 1. React / React Native
import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export interface ILabelValueRowProps {
  label: string;
  subLabel?: string;
  subLabelClassName?: string;
  value: string | number;
  valueType?: "currency" | "text";
  currencySymbol?: string;

  // Icon props
  icon?: keyof typeof MaterialIcons.glyphMap;
  customIcon?: React.ReactNode;
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
  subLabel,
  subLabelClassName = "",
  value,
  valueType = "text",
  currencySymbol = "£",
  icon,
  customIcon,
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

  const resolvedValueColor = valueColor;
  const resolvedIconSize = iconSize ?? WP("4.5%");

  let renderedIcon: React.ReactNode = null;
  if (customIcon) {
    renderedIcon = customIcon;
  } else if (icon) {
    renderedIcon = (
      <MaterialIcons
        name={icon}
        size={resolvedIconSize}
        color={iconColor}
        className={iconClassName}
      />
    );
  }

  return (
    <View className={containerClassName} style={containerStyle}>
      {/* Left side: Icon + Label (+ subLabel) */}
      <View
        className="flex-row gap-2 items-center flex-1 pr-2"
        style={iconContainerStyle}
      >
        {renderedIcon}
        <Text
          style={[
            { fontSize: getResponsiveFontSize("sm") },
            labelColor ? { color: labelColor } : undefined,
            labelStyle,
          ]}
          className={`flex-1 flex-wrap capitalize ${labelClassName}`}
        >
          {label}
          {subLabel ? (
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className={`font-normal text-xs normal-case opacity-80 ${subLabelClassName}`}
            >
              {" "}
              ({subLabel})
            </Text>
          ) : null}
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
