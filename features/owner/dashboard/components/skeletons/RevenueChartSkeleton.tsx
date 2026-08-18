import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function RevenueChartSkeleton() {
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

  // Representative bar heights to simulate chart loading state
  const barHeights = ["55%", "80%", "45%", "90%", "65%", "75%", "50%"];

  return (
    <Animated.View
      key="loading"
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)",
        opacity: pulseAnim,
      }}
      className="w-full p-4 bg-slate-100 shadow-sm"
    >
      {/* Header Placeholder */}
      <View className="flex-row justify-between items-center pb-3 border-b border-slate-200 mb-4">
        <View className="gap-y-1.5">
          {/* Title placeholder */}
          <View className="h-4 w-32 bg-slate-200 rounded" />
          {/* Total amount placeholder */}
          <View className="h-5 w-24 bg-slate-200 rounded" />
        </View>
        {/* Header icon placeholder */}
        <View className="w-5 h-5 rounded-full bg-slate-200" />
      </View>

      {/* Chart Skeleton Body */}
      <View className="h-[210px] justify-between relative py-2">
        {/* Bars & X-Axis Labels Placeholder */}
        <View className="flex-1 flex-row items-end justify-between px-6 pb-6 pt-2 z-10">
          {barHeights.map((h, i) => (
            <View key={i} className="items-center gap-y-2">
              <View style={{ height: h }} className="w-5 bg-slate-200 rounded-t-md" />
              <View className="h-2.5 w-5 bg-slate-200 rounded" />
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
