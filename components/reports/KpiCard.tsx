import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

interface KpiCardProps {
  title: string;
  value: string;
  trendText?: string;
  trendType?: "up" | "down" | "neutral";
  iconName?: keyof typeof MaterialIcons.glyphMap;
  variant?: "dark" | "light";
  containerClassName?: string;
  gradientColors?: [string, string, ...string[]];
}

export default function KpiCard({
  title,
  value,
  trendText,
  trendType = "neutral",
  iconName,
  variant = "light",
  containerClassName = "",
  gradientColors,
}: KpiCardProps) {
  if (variant === "dark") {
    const isUp = trendType === "up";
    const isDown = trendType === "down";

    const content = (
      <>
        <View className="mb-4 flex-row justify-between items-start rounded-lg">
          <View className="flex-1 pr-2">
            <Text className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">{title}</Text>
            <Text className="text-3xl font-extrabold text-white tracking-tight">{value}</Text>
          </View>
          {iconName && (
            <View className="bg-white/10 p-2.5 rounded-lg">
              <MaterialIcons name={iconName} size={20} color="#ffffff" />
            </View>
          )}
        </View>

        {trendText && (
          <View className="flex-row items-center bg-white/10 w-fit px-3 py-1.5 rounded-full self-start">
            <MaterialIcons
              name={isUp ? "trending-up" : isDown ? "trending-down" : "trending-flat"}
              size={16}
              color={isUp ? "#4ade80" : isDown ? "#f87171" : "#a1a1aa"}
            />
            <Text
              className={`text-xs font-bold ml-1.5 ${isUp ? "text-green-400" : isDown ? "text-red-400" : "text-white/75"}`}
            >
              {trendText}
            </Text>
          </View>
        )}
      </>
    );

    if (gradientColors && gradientColors.length > 0) {
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className={`rounded-lg overflow-hidden p-5 shadow-md flex-col justify-between ${containerClassName}`}
        >
          {content}
        </LinearGradient>
      );
    }

    return (
      <View className={`bg-neutral rounded-lg p-5 shadow-md flex-col justify-between ${containerClassName}`}>
        {content}
      </View>
    );
  }

  // Light variant (AOV, Total Orders, Refunds, etc.)
  const isRefunds = title.toLowerCase() === "refunds" || title.toLowerCase().includes("refund");

  return (
    <View
      className={`bg-base-300 border border-base-200 rounded-lg p-4 flex-row items-center gap-4 shadow-sm ${containerClassName}`}
    >
      {iconName && (
        <View
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${isRefunds ? "bg-error/10" : "bg-primary/10"}`}
        >
          <MaterialIcons name={iconName} size={24} color={isRefunds ? "#ff8369" : "#DC2D2A"} />
        </View>
      )}
      <View className="flex-1 min-w-0">
        <Text className="text-[10px] font-bold text-accent uppercase tracking-wider mb-0.5 block">
          {title}
        </Text>
        <Text className={`text-lg font-bold tracking-tight ${isRefunds ? "text-error" : "text-neutral"}`}>
          {value}
        </Text>
      </View>
    </View>
  );
}
