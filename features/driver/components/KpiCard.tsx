import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export interface KpiCardProps {
  title: string;
  value: string;
  trendText?: string;
  trend?: "up" | "neutral" | "down";

  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  variant?: "light" | "dark";
  gradientColors?: string[];
  loading?: boolean;

  valueClassName?: string;
}

export default function KpiCard({
  title = "KPI Title",
  value = "00",
  icon = "zoom-out",
  iconColor,
  trend,
  trendText,
  variant = "light",
  gradientColors,
  loading = false,
  valueClassName,
}: KpiCardProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!loading) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [loading, pulseAnim]);

  // SKELETON LOADER STATE
  if (loading) {
    return (
      <Animated.View
        key="loading"
        style={{
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.05)",
          opacity: pulseAnim,
        }}
        className="w-full min-h-[110px] flex-1 p-4 bg-slate-100 shadow-sm justify-between"
      >
        <View className="flex-col justify-between flex-1">
          <View className="flex-row items-center justify-start gap-2">
            {/* Icon placeholder */}
            <View className="w-8 h-8 rounded-xl bg-slate-200" />
            {/* Title placeholder */}
            <View className="w-16 h-3.5 rounded bg-slate-200" />
          </View>
          <View>
            {/* Value placeholder */}
            <View className="w-24 h-7 rounded bg-slate-200 mt-2" />
            {/* Trend placeholder */}
            {trend && <View className="w-20 h-4 rounded-full bg-slate-200 mt-2" />}
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <LinearGradient
      key="loaded"
      colors={gradientColors as [string, string, ...string[]]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{
        borderRadius: 6,
        borderWidth: 1,
        borderColor: variant === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      }}
      className="w-full min-h-[110px] flex-1 p-4 shadow-sm"
    >
      <View className="flex-col justify-between flex-1">
        <View className="flex-row items-center justify-start gap-2">
          <View className={`rounded-xl p-2 ${variant === "dark" ? "bg-success" : "bg-white"}`}>
            <MaterialIcons
              name={icon}
              size={18}
              color={iconColor ? iconColor : variant === "dark" ? "#ffffff" : "#000000"}
            />
          </View>
          <Text
            className={`text-sm font-semibold capitalize ${
              variant === "dark" ? "text-base-100" : "text-neutral/60"
            }`}
          >
            {title}
          </Text>
        </View>
        <View>
          <Text
            className={`text-2xl font-bold mt-1 ${variant === "dark" ? "text-base-100" : "text-neutral"} ${valueClassName}`}
          >
            {value}
          </Text>

          {/* Trend Badge */}
          {trend && (
            <View
              className={`flex-row items-center self-start px-1.5 py-1 rounded-full gap-1 mt-2   ${
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
}
