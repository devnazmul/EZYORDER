import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface Trend {
  type: "up" | "down";
  value: string;
  label: string;
}

interface KpiCardProps {
  title: string;
  value: string;
  iconName: any;
  iconType?: "Feather" | "MaterialCommunity";
  colorScheme?: "green" | "purple" | "yellow" | "blue" | "default";
  variant?: "light" | "dark";
  subtitle?: string;
  trend?: Trend;
  loading?: boolean;
}

export default function KpiCard({
  title,
  value,
  iconName,
  iconType = "Feather",
  colorScheme = "default",
  variant = "light",
  subtitle,
  trend,
  loading = false,
}: KpiCardProps) {
  // Gradients for dark variants
  const gradients = {
    green: ["#0f2f21", "#051510"],
    purple: ["#2d124d", "#150629"],
    yellow: ["#3a2c00", "#1f1700"],
    blue: ["#0a2540", "#030e1a"],
    default: ["#1e1e2e", "#0f0f15"],
  };

  // Base colors for light variants
  const lightBgColors = {
    green: "bg-emerald-50 border-emerald-100",
    purple: "bg-purple-50 border-purple-100",
    yellow: "bg-amber-50 border-amber-100",
    blue: "bg-blue-50 border-blue-100",
    default: "bg-slate-50 border-slate-100",
  };

  // Text color values
  const lightTextColors = {
    green: "text-emerald-700",
    purple: "text-purple-700",
    yellow: "text-amber-700",
    blue: "text-blue-700",
    default: "text-slate-800",
  };

  const lightSubtextColors = {
    green: "text-emerald-600/70",
    purple: "text-purple-600/70",
    yellow: "text-amber-600/70",
    blue: "text-blue-600/70",
    default: "text-slate-500",
  };

  const renderIcon = (color: string, size: number = 20) => {
    if (iconType === "MaterialCommunity") {
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    }
    return <Feather name={iconName} size={size} color={color} />;
  };

  const isDark = variant === "dark";

  // SKELETON LOADER STATE
  if (loading) {
    return (
      <View
        key="loading"
        className={`w-full p-5 rounded-2xl border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-base-300 border-base-200"
        } shadow-sm min-h-[120px] justify-center items-center`}
      >
        <ActivityIndicator size="small" color="#DC2D2A" />
      </View>
    );
  }

  const cardContent = (
    <View key="loaded" className="flex-1 justify-between min-h-[110px]">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text
            className={`text-[10px] font-black uppercase tracking-wider ${
              isDark ? "text-slate-400" : lightSubtextColors[colorScheme]
            }`}
          >
            {title}
          </Text>
          <Text
            className={`text-2xl font-black mt-1 ${isDark ? "text-white" : lightTextColors[colorScheme]}`}
          >
            {value}
          </Text>
        </View>
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            isDark ? "bg-white/10" : "bg-white shadow-sm border border-neutral/5"
          }`}
        >
          {renderIcon(isDark ? "#ffffff" : colorScheme === "default" ? "#DC2D2A" : "#6E6E6E")}
        </View>
      </View>

      <View className="mt-4">
        {trend ? (
          <View className="flex-row items-center flex-wrap gap-1">
            <View
              className={`flex-row items-center px-1.5 py-0.5 rounded-md ${
                trend.type === "up" ? "bg-emerald-500/10" : "bg-rose-500/10"
              }`}
            >
              <Feather
                name={trend.type === "up" ? "trending-up" : "trending-down"}
                size={11}
                color={trend.type === "up" ? "#36d399" : "#ff8369"}
              />
              <Text
                className={`text-[9px] font-bold ml-1 ${
                  trend.type === "up" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {trend.value}
              </Text>
            </View>
            <Text className={`text-[8px] font-bold ${isDark ? "text-slate-500" : "text-slate-400"} uppercase`}>
              {trend.label}
            </Text>
          </View>
        ) : subtitle ? (
          <Text className={`text-[10px] font-semibold ${isDark ? "text-slate-400" : lightSubtextColors[colorScheme]}`}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (isDark) {
    return (
      <LinearGradient
        colors={gradients[colorScheme]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full p-5 rounded-2xl shadow-md border border-white/5"
      >
        {cardContent}
      </LinearGradient>
    );
  }

  return (
    <View className={`w-full p-5 rounded-2xl border ${lightBgColors[colorScheme]} shadow-sm`}>
      {cardContent}
    </View>
  );
}
