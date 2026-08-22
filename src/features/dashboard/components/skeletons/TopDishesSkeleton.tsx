import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function TopDishesSkeleton() {
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
        <View className="h-4 w-48 bg-slate-200 rounded" />
      </View>

      {/* Leaderboard Row Items Skeleton */}
      <View className="gap-y-2.5">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className="flex-row items-center justify-between p-3 border rounded-xl gap-x-3 bg-white/60 border-slate-200"
          >
            {/* Rank & Dish Info */}
            <View className="flex-row items-center gap-3 flex-1 min-w-0">
              <View className="w-7 h-7 rounded-full bg-slate-200" />
              <View className="flex-1 min-w-0 items-start gap-1.5">
                <View className="h-3.5 w-28 bg-slate-200 rounded" />
                <View className="h-4 w-16 bg-slate-200 rounded-full" />
              </View>
            </View>

            {/* Progress Bar & Percentage */}
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-7 bg-slate-200 rounded" />
              <View className="h-2 bg-slate-200 rounded-full w-16" />
            </View>

            {/* Cup Icon Placeholder */}
            <View className="w-6 items-center justify-center">
              <View className="w-5 h-5 bg-slate-200 rounded-full" />
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
