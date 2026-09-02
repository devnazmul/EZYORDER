// 1. React / React Native
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// 4. Shared components
import CustomText from "../CustomText";
import KpiCardSkeleton from "../skeletons/KpiCardSkeleton";

// 5. Shared hooks
import { useInView } from "@/hooks";

// 7. Constants / utils
import { COLORS } from "@/constants";
import { getAnimatedCounterText, WP } from "@/utils";

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
  isAnimated?: boolean;
  animationDuration?: number;
}

interface ITrendBadgeProps {
  trend: ITrendType;
  trendText?: string;
}

const TREND_CONFIG = {
  up: {
    bg: "bg-success/20",
    icon: "trending-up" as const,
    color: COLORS.success,
  },
  down: {
    bg: "bg-error/20",
    icon: "trending-down" as const,
    color: COLORS.error,
  },
  neutral: {
    bg: "bg-white/10",
    icon: "trending-flat" as const,
    color: "rgba(255, 255, 255, 0.7)",
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
      <CustomText
        size="xs"
        weight="medium"
        style={{ color: config.color }}
        className="capitalize truncate"
        numberOfLines={2}
      >
        {trendText}
      </CustomText>
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
      <CustomText
        size="sm"
        weight="semibold"
        style={{ color: isDark ? COLORS.base100 : COLORS.neutral }}
        className="flex-1 flex-wrap capitalize"
      >
        {title}
      </CustomText>
    </View>
  );
}

interface ICardValueBodyProps {
  value: string;
  textColor?: string;
  valueClassName: string;
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
  subtitle,
  isDark,
  trend,
  trendText,
  rightElement,
}: Readonly<ICardValueBodyProps>) {
  const resolvedValueColor =
    textColor || (isDark ? COLORS.base100 : COLORS.neutral);

  return (
    <View className="flex-row items-end justify-between">
      <View className={`flex-1 ${rightElement ? "mr-2 max-w-[45%]" : ""}`}>
        <CustomText
          size="xl"
          weight="bold"
          style={{ color: resolvedValueColor }}
          className={`mt-1 ${valueClassName}`}
        >
          {value}
        </CustomText>

        {subtitle ? (
          <CustomText
            size="xs"
            weight="medium"
            style={{
              color: isDark ? COLORS.base100 : COLORS.accent,
            }}
            className="mt-0.5"
          >
            {subtitle}
          </CustomText>
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
  isAnimated = true,
  animationDuration = 1000,
}: Readonly<IKpiCardProps>) {
  const [animProgress, setAnimProgress] = useState<number>(isAnimated ? 0 : 1);
  const animVal = useRef(new Animated.Value(isAnimated ? 0 : 1)).current;

  const cardMinHeight = minHeight ?? 110;
  const { containerRef, isInView, checkVisibility } = useInView<View>(
    cardMinHeight,
    {
      threshold: 0.8,
      enabled: isAnimated,
    },
  );

  useEffect(() => {
    if (!isAnimated) {
      setAnimProgress(1);
      return;
    }

    if (!isInView) {
      animVal.setValue(0);
      setAnimProgress(0);
      return;
    }

    animVal.setValue(0);
    setAnimProgress(0);

    const listenerId = animVal.addListener(({ value: v }) => {
      setAnimProgress(v);
    });

    const animation = Animated.timing(animVal, {
      toValue: 1,
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animVal.removeListener(listenerId);
      animation.stop();
    };
  }, [isInView, isAnimated, animationDuration, value]);

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

  const showBackgroundIcon =
    !disableBackgroundIcon && !rightElement && Boolean(icon);

  const displayedValue = getAnimatedCounterText(value, animProgress);

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
        minHeight: cardMinHeight,
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
          value={displayedValue}
          textColor={textColor}
          valueClassName={valueClassName}
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
        ref={containerRef}
        onLayout={checkVisibility}
        activeOpacity={0.85}
        onPress={onPress}
        className="flex-1 flex-col"
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      ref={containerRef}
      onLayout={checkVisibility}
      className="flex-1 flex-col"
    >
      {cardContent}
    </View>
  );
}
