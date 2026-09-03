import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function OrdersByTypeChartSkeleton() {
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
      <View className="pb-3 border-b border-slate-200 mb-4">
        <View className="h-4 w-44 bg-slate-200 rounded" />
      </View>

      {/* Donut Chart & Legend Row */}
      <View className="flex-row items-center justify-between px-2 py-1">
        {/* Donut Ring Placeholder */}
        <View className="w-24 h-24 rounded-full border-[10px] border-slate-200 items-center justify-center">
          <View className="w-8 h-3 bg-slate-200 rounded mb-1" />
          <View className="w-10 h-2 bg-slate-200 rounded" />
        </View>

        {/* Legend Items Placeholder */}
        <View className="flex-1 ml-6 gap-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="flex-row items-center justify-between w-[90%] py-0.5 mx-auto">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <View className="h-3 w-16 bg-slate-200 rounded" />
                <View className="h-3 w-8 bg-slate-200 rounded" />
              </View>
              <View className="h-3 w-6 bg-slate-200 rounded" />
            </View>
          ))}
        </View>
      </View>

      {/* Action Button Placeholder */}
      <View className="w-full mt-4 h-10 bg-slate-200 rounded-lg" />
    </Animated.View>
  );
}
