// 1. React / React Native
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { handleCallPhone, handleSendEmail } from "@/utils";
import {
  getResponsiveFontSize,
  type ResponsiveSize,
} from "@/utils/getResponsiveSizes";

export type TextVariant =
  "brand-primary" | "primary" | "secondary" | "tertiary" | "currency";
export type TextType = "currency" | "email" | "phone";
export type FontWeight =
  "normal" | "medium" | "semibold" | "bold" | "extrabold";

export interface ICustomTextProps extends TextProps {
  variant?: TextVariant;
  type?: TextType;
  showIcon?: boolean;
  currencySymbol?: string;
  weight?: FontWeight;
  size?: ResponsiveSize | "base" | number;
  fontFamily?: string;
  className?: string;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const TYPE_ICONS: Record<
  Extract<TextType, "email" | "phone">,
  keyof typeof MaterialIcons.glyphMap
> = {
  email: "mail-outline",
  phone: "phone-iphone",
};

const VARIANT_CLASSES: Record<TextVariant, string> = {
  primary: "text-neutral",
  secondary: "text-neutral/80",
  tertiary: "text-neutral/60",
  currency: "text-primary",
  "brand-primary": "text-primary",
};

const VARIANT_STYLES: Record<TextVariant, TextStyle> = {
  primary: { color: COLORS.neutral },
  secondary: { color: "rgba(0, 0, 0, 0.75)" },
  tertiary: { color: COLORS.accent },
  currency: { color: COLORS.primary },
  "brand-primary": { color: COLORS.primary },
};

const WEIGHT_CLASSES: Record<FontWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const WEIGHT_STYLES: Record<FontWeight, TextStyle> = {
  normal: { fontWeight: "400" },
  medium: { fontWeight: "500" },
  semibold: { fontWeight: "600" },
  bold: { fontWeight: "700" },
  extrabold: { fontWeight: "800" },
};

const DEFAULT_ROBOTO_FONT_MAP: Record<FontWeight, string> = {
  normal: "Roboto_400Regular",
  medium: "Roboto_500Medium",
  semibold: "Roboto_500Medium",
  bold: "Roboto_700Bold",
  extrabold: "Roboto_900Black",
};

const getFontSizeStyle = (
  size?: ResponsiveSize | "base" | number,
): TextStyle => {
  if (typeof size === "number") {
    return { fontSize: size };
  }
  if (typeof size === "string") {
    const normalizedSize = size === "base" ? "md" : size;
    return { fontSize: getResponsiveFontSize(normalizedSize) };
  }
  return {};
};

const formatTextContent = (
  children: React.ReactNode,
  type?: TextType,
  currencySymbol?: string,
): React.ReactNode => {
  if (
    type === "currency" &&
    currencySymbol &&
    (typeof children === "string" || typeof children === "number")
  ) {
    const childStr = String(children).trim();
    if (!childStr.startsWith(currencySymbol)) {
      return `${currencySymbol}${childStr}`;
    }
  }
  return children;
};

const handleTypePress = (children: React.ReactNode, type?: TextType) => {
  const val = String((children as string | number) || "").trim();
  if (!val) return;
  if (type === "email") {
    handleSendEmail(val);
  } else if (type === "phone") {
    handleCallPhone(val);
  }
};

export default function CustomText({
  variant = "primary",
  type,
  showIcon = true,
  currencySymbol,
  weight = "normal",
  size,
  fontFamily,
  className = "",
  style,
  children,
  ...props
}: Readonly<ICustomTextProps>) {
  const isPrimaryType = type === "email" || type === "phone";
  const variantClass = isPrimaryType
    ? "text-primary"
    : VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const weightClass = WEIGHT_CLASSES[weight] || WEIGHT_CLASSES.normal;

  const fontSizeStyle = getFontSizeStyle(size);
  const resolvedFontFamily =
    fontFamily ||
    DEFAULT_ROBOTO_FONT_MAP[weight] ||
    DEFAULT_ROBOTO_FONT_MAP.normal;

  const variantStyle = isPrimaryType
    ? { color: COLORS.primary }
    : VARIANT_STYLES[variant];

  const fontStyle: TextStyle = {
    ...variantStyle,
    ...WEIGHT_STYLES[weight],
    ...fontSizeStyle,
    fontFamily: resolvedFontFamily,
  };

  const formattedContent = formatTextContent(children, type, currencySymbol);

  const textElement = (
    <Text
      className={`${variantClass} ${weightClass} ${className}`.trim()}
      style={[fontStyle, style]}
      {...props}
    >
      {formattedContent}
    </Text>
  );

  const isClickable = isPrimaryType;
  const iconName = showIcon && isPrimaryType ? TYPE_ICONS[type] : null;

  if (!iconName && !isClickable) {
    return textElement;
  }

  const iconSize =
    typeof fontSizeStyle.fontSize === "number"
      ? Math.max(12, fontSizeStyle.fontSize)
      : 14;

  const ContainerComponent = isClickable ? TouchableOpacity : View;

  return (
    <ContainerComponent
      onPress={isClickable ? () => handleTypePress(children, type) : undefined}
      activeOpacity={0.7}
      className="flex-row items-center gap-1.5"
    >
      {iconName ? (
        <MaterialIcons
          name={iconName}
          size={iconSize}
          color={COLORS.primary}
          className="-mb-1.5"
        />
      ) : null}
      {textElement}
    </ContainerComponent>
  );
}
