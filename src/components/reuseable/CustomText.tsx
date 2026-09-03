// 1. React / React Native
import React from "react";
import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import {
  getResponsiveFontSize,
  type ResponsiveSize,
} from "@/utils/getResponsiveSizes";

export type ITextVariant = "primary" | "secondary" | "tertiary" | "currency";
export type IFontWeight =
  "normal" | "medium" | "semibold" | "bold" | "extrabold";

export interface ICustomTextProps extends TextProps {
  variant?: ITextVariant;
  currencySymbol?: string;
  weight?: IFontWeight;
  size?: ResponsiveSize | "base" | number;
  fontFamily?: string;
  className?: string;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ITextVariant, string> = {
  primary: "text-neutral",
  secondary: "text-neutral/80",
  tertiary: "text-neutral/60",
  currency: "text-primary",
};

const VARIANT_STYLES: Record<ITextVariant, TextStyle> = {
  primary: { color: COLORS.neutral },
  secondary: { color: "rgba(0, 0, 0, 0.75)" },
  tertiary: { color: COLORS.accent },
  currency: { color: COLORS.primary },
};

const WEIGHT_CLASSES: Record<IFontWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const WEIGHT_STYLES: Record<IFontWeight, TextStyle> = {
  normal: { fontWeight: "400" },
  medium: { fontWeight: "500" },
  semibold: { fontWeight: "600" },
  bold: { fontWeight: "700" },
  extrabold: { fontWeight: "800" },
};

export default function CustomText({
  variant = "primary",
  currencySymbol,
  weight = "normal",
  size,
  fontFamily,
  className = "",
  style,
  children,
  ...props
}: Readonly<ICustomTextProps>) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const weightClass = WEIGHT_CLASSES[weight] || WEIGHT_CLASSES.normal;

  const fontSizeStyle: TextStyle = React.useMemo(() => {
    if (typeof size === "number") {
      return { fontSize: size };
    }
    if (typeof size === "string") {
      const normalizedSize = size === "base" ? "md" : size;
      return { fontSize: getResponsiveFontSize(normalizedSize) };
    }
    return {};
  }, [size]);

  const fontStyle: TextStyle = {
    ...VARIANT_STYLES[variant],
    ...WEIGHT_STYLES[weight],
    ...fontSizeStyle,
    ...(fontFamily ? { fontFamily } : {}),
  };

  const formattedContent = React.useMemo(() => {
    if (
      currencySymbol &&
      (typeof children === "string" || typeof children === "number")
    ) {
      const childStr = String(children).trim();
      if (!childStr.startsWith(currencySymbol)) {
        return `${currencySymbol}${childStr}`;
      }
    }
    return children;
  }, [children, currencySymbol]);

  return (
    <Text
      className={`${variantClass} ${weightClass} ${className}`.trim()}
      style={[fontStyle, style]}
      {...props}
    >
      {formattedContent}
    </Text>
  );
}
