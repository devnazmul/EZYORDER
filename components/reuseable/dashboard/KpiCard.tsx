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
  subtitle?: string;
  onPress?: () => void;
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
  subtitle,
  onPress,
}: KpiCardProps) {
  // SKELETON LOADER STATE
  if (loading) {
    return <KpiCardSkeleton trend={trend} />;
  }

  const defaultColors: [string, string, ...string[]] =
    variant === "dark" ? ["#1E293B", "#0F172A"] : ["#FFFFFF", "#F8FAFC"];

  const colorsToUse = (gradientColors && gradientColors.length >= 2 ? gradientColors : defaultColors) as [
    string,
    string,
    ...string[],
  ];

  const isHexOrRgbBg = iconBgColor && (iconBgColor.startsWith("#") || iconBgColor.startsWith("rgb"));
  const iconBgClass = iconBgColor
    ? isHexOrRgbBg
      ? ""
      : iconBgColor.startsWith("bg-")
        ? iconBgColor
        : `bg-${iconBgColor}`
    : variant === "dark"
      ? "bg-success"
      : "bg-white";

  const cardContent = (
    <LinearGradient
      key="loaded"
      colors={colorsToUse}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: variant === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      }}
      className={`min-h-[110px] flex-1 p-4 shadow-sm ${containerClassName}`}
    >
      <View className="flex-col justify-between flex-1">
        <View className="flex-row items-center justify-start gap-2">
          <View
            className={`rounded-xl self-start p-2 ${iconBgClass}`}
            style={{
              borderRadius: 12,
              ...(isHexOrRgbBg ? { backgroundColor: iconBgColor } : {}),
            }}
          >
            <MaterialIcons
              name={icon}
              size={16}
              color={iconColor ? iconColor : variant === "dark" ? "#ffffff" : "#000000"}
            />
          </View>
          <Text
            className={`flex-1 flex-wrap text-sm font-semibold capitalize ${
              variant === "dark" ? "text-base-100" : "text-neutral/60"
            }`}
          >
            {title}
          </Text>
        </View>
        <View>
          <Text
            className={`text-2xl font-bold mt-1 ${
              variant === "dark" ? "text-base-100" : "text-neutral"
            } ${valueClassName}`}
          >
            {value}
          </Text>

          {subtitle ? (
            <Text
              className={`text-[10px] font-medium mt-0.5 ${
                variant === "dark" ? "text-white/70" : "text-accent"
              }`}
            >
              {subtitle}
            </Text>
          ) : null}

          {/* Trend Badge */}
          {trend && (
            <View
              className={`flex-row items-center self-start px-1.5 py-1 rounded-full gap-1 mt-2 ${
                trend === "up" ? "bg-success/20" : trend === "down" ? "bg-error/20" : "bg-white/10"
              }`}
            >
              <MaterialIcons
                name={trend === "up" ? "trending-up" : trend === "down" ? "trending-down" : "trending-flat"}
                size={14}
                color={trend === "up" ? "#36d399" : trend === "down" ? "#ff8369" : "rgba(255, 255, 255, 0.7)"}
              />
              <Text
                className={`text-[8px] font-medium capitalize truncate ${
                  trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-white/70"
                }`}
                numberOfLines={1}
              >
                {trendText}
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} className="flex-1 flex-col">
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}
