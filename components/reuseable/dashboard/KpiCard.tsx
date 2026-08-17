import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import KpiCardSkeleton from "../skeletons/KpiCardSkeleton";

export interface KpiCardProps {
  title: string;
  value: string;
  trendText?: string;
  trend?: "up" | "neutral" | "down";

  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  variant?: "light" | "dark";
  gradientColors?: string[];
  loading?: boolean;

  valueClassName?: string;
  containerClassName?: string;
  minHeight?: number;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

interface TrendBadgeProps {
  trend: "up" | "neutral" | "down";
  trendText?: string;
}

function TrendBadge({ trend, trendText }: Readonly<TrendBadgeProps>) {
  const bgClass =
    trend === "up"
      ? "bg-success/20"
      : trend === "down"
        ? "bg-error/20"
        : "bg-white/10";
  const iconName =
    trend === "up"
      ? "trending-up"
      : trend === "down"
        ? "trending-down"
        : "trending-flat";
  const iconColor =
    trend === "up"
      ? "#36d399"
      : trend === "down"
        ? "#ff8369"
        : "rgba(255, 255, 255, 0.7)";
  const textClass =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-error"
        : "text-white/70";

  return (
    <View className={`flex-row items-center self-start px-2 py-1 rounded-full gap-1 mt-2 ${bgClass}`}>
      <MaterialIcons name={iconName} size={WP("3.75%")} color={iconColor} />
      <Text
        style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
        className={`font-medium capitalize truncate ${textClass}`}
        numberOfLines={2}
      >
        {trendText}
      </Text>
    </View>
  );
}

function getIconBgClass(iconBgColor?: string, variant?: string, isHexOrRgbBg?: boolean) {
  if (!iconBgColor) {
    return variant === "dark" ? "bg-success" : "bg-white";
  }
  if (isHexOrRgbBg) return "";
  return iconBgColor.startsWith("bg-") ? iconBgColor : `bg-${iconBgColor}`;
}

function getColorsToUse(gradientColors?: string[], variant?: string) {
  const defaultColors: [string, string, ...string[]] =
    variant === "dark" ? ["#1E293B", "#0F172A"] : ["#FFFFFF", "#F8FAFC"];
  return (
    gradientColors && gradientColors.length >= 2 ? gradientColors : defaultColors
  ) as [string, string, ...string[]];
}

export default function KpiCard({
  title = "KPI Title",
  value = "00",
  icon = "zoom-out",
  iconColor,
  iconBgColor,
  trend,
  trendText,
  variant = "light",
  gradientColors,
  loading = false,
  valueClassName = "",
  containerClassName = "",
  minHeight,
  subtitle,
  rightElement,
  onPress,
}: Readonly<KpiCardProps>) {
  // SKELETON LOADER STATE
  if (loading) {
    return <KpiCardSkeleton trend={trend} />;
  }

  const isHexOrRgbBg =
    !!iconBgColor &&
    (iconBgColor.startsWith("#") || iconBgColor.startsWith("rgb"));

  const colorsToUse = getColorsToUse(gradientColors, variant);
  const iconBgClass = getIconBgClass(iconBgColor, variant, isHexOrRgbBg);

  const cardContent = (
    <LinearGradient
      key="loaded"
      colors={colorsToUse}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor:
          variant === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
        padding: WP("3.5%"),
        minHeight: minHeight ?? 110,
      }}
      className={`flex-1 shadow-sm ${containerClassName}`}
    >
      <View
        className="flex-col justify-between flex-1"
        style={{ gap: WP("2%") }}
      >
        <View
          className="flex-row items-center justify-start"
          style={{ gap: WP("2%") }}
        >
          <View
            className={`rounded-xl self-start p-2 ${iconBgClass}`}
            style={{
              borderRadius: 12,
              ...(isHexOrRgbBg ? { backgroundColor: iconBgColor } : {}),
            }}
          >
            <MaterialIcons
              name={icon}
              size={WP("4%")}
              color={
                iconColor
                  ? iconColor
                  : variant === "dark"
                    ? "#ffffff"
                    : "#000000"
              }
            />
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm") }}
            className={`flex-1 flex-wrap font-semibold capitalize ${
              variant === "dark" ? "text-base-100" : "text-neutral/60"
            }`}
          >
            {title}
          </Text>
        </View>
        <View className="flex-row items-end justify-between">
          <View className={`flex-1 ${rightElement ? "mr-2 max-w-[45%]" : ""}`}>
            <Text
              style={{ fontSize: getResponsiveFontSize("xl") }}
              className={`font-bold mt-1 ${
                variant === "dark" ? "text-base-100" : "text-neutral"
              } ${valueClassName}`}
            >
              {value}
            </Text>

            {subtitle ? (
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className={`font-medium mt-0.5 ${variant === "dark" ? "text-white/70" : "text-accent"}`}
              >
                {subtitle}
              </Text>
            ) : null}

            {/* Trend Badge */}
            {trend ? (
              <TrendBadge trend={trend} trendText={trendText} />
            ) : null}
          </View>

          {/* Right Element Slot */}
          {rightElement ? (
            <View className="justify-end items-end flex-1 max-w-[49%]">
              {rightElement}
            </View>
          ) : null}
        </View>
      </View>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="flex-1 flex-col"
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}
