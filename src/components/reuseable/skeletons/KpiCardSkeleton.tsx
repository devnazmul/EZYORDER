import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface KpiCardSkeletonProps {
  trend?: "up" | "neutral" | "down";
}

export default function KpiCardSkeleton({ trend }: KpiCardSkeletonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, [pulseAnim]);

  return (
    <Animated.View
      style={{
        borderRadius: 16,
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
