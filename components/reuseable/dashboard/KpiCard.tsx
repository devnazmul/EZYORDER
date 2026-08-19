import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import KpiCardSkeleton from "../skeletons/KpiCardSkeleton";

export type ITrendType = "up" | "neutral" | "down";

export interface IKpiCardProps {
  title: string;
  value: string;
  trendText?: string;
  trend?: ITrendType;

  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  textColor?: string;
  variant?: "light" | "dark";
  gradientColors?: string[];
  loading?: boolean;

  valueClassName?: string;
  containerClassName?: string;
  minHeight?: number;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  disableBackgroundIcon?: boolean;
}

interface ITrendBadgeProps {
  trend: ITrendType;
  trendText?: string;
}

const TREND_CONFIG = {
  up: {
    bg: "bg-success/20",
    icon: "trending-up" as const,
    color: "#36d399",
    text: "text-success",
  },
  down: {
    bg: "bg-error/20",
    icon: "trending-down" as const,
    color: "#ff8369",
    text: "text-error",
  },
  neutral: {
    bg: "bg-white/10",
    icon: "trending-flat" as const,
    color: "rgba(255, 255, 255, 0.7)",
    text: "text-white/70",
  },
};

function TrendBadge({ trend, trendText }: Readonly<ITrendBadgeProps>) {
  const config = TREND_CONFIG[trend] || TREND_CONFIG.neutral;

  return (
    <View
      className={`flex-row items-center self-start px-2 py-1 rounded-full gap-1 mt-2 ${config.bg}`}
    >
      <MaterialIcons
        name={config.icon}
        size={WP("3.75%")}
        color={config.color}
      />
      <Text
        style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
        className={`font-medium capitalize truncate ${config.text}`}
        numberOfLines={2}
      >
        {trendText}
      </Text>
    </View>
  );
}

const DEFAULT_DARK_GRADIENT: [string, string, ...string[]] = [
  "#1E293B",
  "#0F172A",
];
const DEFAULT_LIGHT_GRADIENT: [string, string, ...string[]] = [
  "#FFFFFF",
  "#F8FAFC",
];

function getGradientColors(
  gradientColors?: string[],
  isDark?: boolean,
): [string, string, ...string[]] {
  if (gradientColors && gradientColors.length >= 2) {
    return gradientColors as [string, string, ...string[]];
  }
  return isDark ? DEFAULT_DARK_GRADIENT : DEFAULT_LIGHT_GRADIENT;
}

function getValueTextColorClass(
  isDark: boolean,
  hasCustomTextColor: boolean,
): string {
  if (isDark) return "text-base-100";
  if (hasCustomTextColor) return "";
  return "text-neutral";
}

interface IBackgroundIconWatermarkProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  isDark: boolean;
}

function BackgroundIconWatermark({
  icon,
  color,
  isDark,
}: Readonly<IBackgroundIconWatermarkProps>) {
  return (
    <MaterialIcons
      name={icon}
      size={Math.min(130, WP("30%"))}
      color={color}
      style={{
        position: "absolute",
        bottom: -55,
        right: -55,
        opacity: isDark ? 0.08 : 0.04,
      }}
    />
  );
}

interface ICardHeaderProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  isHexOrRgbBg: boolean;
  title: string;
  isDark: boolean;
}

function CardHeader({
  icon,
  iconColor,
  iconBg,
  isHexOrRgbBg,
  title,
  isDark,
}: Readonly<ICardHeaderProps>) {
  return (
    <View
      className="flex-row items-center justify-start"
      style={{ gap: WP("2%") }}
    >
      <View
        className={`rounded-xl self-start p-2 ${isHexOrRgbBg ? "" : iconBg}`}
        style={{
          borderRadius: 12,
          ...(isHexOrRgbBg ? { backgroundColor: iconBg } : {}),
        }}
      >
        <MaterialIcons name={icon} size={WP("4%")} color={iconColor} />
      </View>
      <Text
        style={{ fontSize: getResponsiveFontSize("sm") }}
        className={`flex-1 flex-wrap font-semibold capitalize ${
          isDark ? "text-base-100" : "text-neutral/60"
        }`}
      >
        {title}
      </Text>
    </View>
  );
}

interface ICardValueBodyProps {
  value: string;
  textColor?: string;
  valueClassName: string;
  valueTextColorClass: string;
  subtitle?: string;
  isDark: boolean;
  trend?: ITrendType;
  trendText?: string;
  rightElement?: React.ReactNode;
}

function CardValueBody({
  value,
  textColor,
  valueClassName,
  valueTextColorClass,
  subtitle,
  isDark,
  trend,
  trendText,
  rightElement,
}: Readonly<ICardValueBodyProps>) {
  return (
    <View className="flex-row items-end justify-between">
      <View className={`flex-1 ${rightElement ? "mr-2 max-w-[45%]" : ""}`}>
        <Text
          style={{
            fontSize: getResponsiveFontSize("xl"),
            ...(textColor ? { color: textColor } : {}),
          }}
          className={`font-bold mt-1 ${valueTextColorClass} ${valueClassName}`}
        >
          {value}
        </Text>

        {subtitle ? (
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className={`font-medium mt-0.5 ${isDark ? "text-white/70" : "text-accent"}`}
          >
            {subtitle}
          </Text>
        ) : null}

        {trend ? <TrendBadge trend={trend} trendText={trendText} /> : null}
      </View>

      {rightElement ? (
        <View className="justify-end items-end flex-1 max-w-[49%]">
          {rightElement}
        </View>
      ) : null}
    </View>
  );
}

export default function KpiCard({
  title = "KPI Title",
  value = "00",
  icon = "zoom-out",
  iconColor,
  iconBgColor,
  textColor,
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
  disableBackgroundIcon = false,
}: Readonly<IKpiCardProps>) {
  // SKELETON LOADER STATE
  if (loading) {
    return <KpiCardSkeleton trend={trend} />;
  }

  const isDark = variant === "dark";
  const colorsToUse = getGradientColors(gradientColors, isDark);

  const resolvedIconColor = iconColor || (isDark ? "#ffffff" : "#000000");
  const resolvedIconBg = iconBgColor || (isDark ? "bg-success" : "bg-white");
  const isHexOrRgbBg =
    resolvedIconBg.startsWith("#") || resolvedIconBg.startsWith("rgb");

  const valueTextColorClass = getValueTextColorClass(
    isDark,
    Boolean(textColor),
  );
  const showBackgroundIcon =
    !disableBackgroundIcon && !rightElement && Boolean(icon);

  const cardContent = (
    <LinearGradient
      key="loaded"
      colors={colorsToUse}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
        padding: WP("3.5%"),
        minHeight: minHeight ?? 110,
        overflow: "hidden",
      }}
      className={`flex-1 shadow-sm ${containerClassName}`}
    >
      {showBackgroundIcon ? (
        <BackgroundIconWatermark
          icon={icon}
          color={resolvedIconColor}
          isDark={isDark}
        />
      ) : null}

      <View
        className="flex-col justify-between flex-1"
        style={{ gap: WP("2%"), zIndex: 1 }}
      >
        <CardHeader
          icon={icon}
          iconColor={resolvedIconColor}
          iconBg={resolvedIconBg}
          isHexOrRgbBg={isHexOrRgbBg}
          title={title}
          isDark={isDark}
        />
        <CardValueBody
          value={value}
          textColor={textColor}
          valueClassName={valueClassName}
          valueTextColorClass={valueTextColorClass}
          subtitle={subtitle}
          isDark={isDark}
          trend={trend}
          trendText={trendText}
          rightElement={rightElement}
        />
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
