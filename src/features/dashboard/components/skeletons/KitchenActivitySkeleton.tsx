import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function KitchenActivitySkeleton() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
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
      style={{ opacity: pulseAnim }}
      className="bg-neutral p-5 rounded-2xl mb-6 shadow-md"
    >
      {/* Header Placeholder */}
      <View className="flex-row items-center gap-2 pb-3 border-b border-white/10 mb-4">
        <View className="w-4 h-4 rounded bg-white/20" />
        <View className="h-4 w-32 bg-white/20 rounded" />
      </View>

      <View className="gap-y-4">
        {/* Row 1: Waiting Orders & Delayed Placeholder */}
        <View className="flex-row items-center border-b border-white/10 pb-3">
          <View className="flex-1 flex-row items-center justify-between pr-3">
            <View className="flex-row items-center gap-1.5">
              <View className="w-3.5 h-3.5 rounded bg-white/10" />
              <View className="h-3 w-20 bg-white/10 rounded" />
            </View>
            <View className="h-6 w-6 bg-white/20 rounded" />
          </View>

          <View className="w-[1px] h-6 bg-white/10" />

          <View className="flex-1 flex-row items-center justify-between pl-3">
            <View className="flex-row items-center gap-1.5">
              <View className="w-3.5 h-3.5 rounded bg-white/10" />
              <View className="h-3 w-16 bg-white/10 rounded" />
            </View>
            <View className="h-6 w-6 bg-white/20 rounded" />
          </View>
        </View>

        {/* Row 2: Avg Prep Time Placeholder */}
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3.5 h-3.5 rounded bg-white/10" />
            <View className="h-3 w-24 bg-white/10 rounded" />
          </View>
          <View className="h-6 w-12 bg-white/20 rounded" />
        </View>
      </View>

      {/* Button Placeholder */}
      <View className="w-full mt-5 bg-white/10 h-10 rounded-lg" />
    </Animated.View>
  );
}
