import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function RecentOrdersSkeleton() {
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
      className="w-full bg-slate-100 shadow-sm overflow-hidden"
    >
      {/* Header Placeholder */}
      <View className="p-4 pb-3 border-b border-slate-200">
        <View className="h-4 w-44 bg-slate-200 rounded" />
      </View>

      {/* Order Rows Placeholder */}
      <View className="divide-y divide-slate-200">
        {[1, 2, 3].map((i) => (
          <View key={i} className="p-4 flex-row items-center justify-between">
            <View className="flex-1 mr-4 gap-y-1.5">
              <View className="h-3.5 w-16 bg-slate-200 rounded" />
              <View className="h-2.5 w-40 bg-slate-200 rounded" />
              <View className="h-2.5 w-28 bg-slate-200 rounded" />
            </View>
            <View className="flex-row items-center gap-3">
              <View className="h-3.5 w-12 bg-slate-200 rounded" />
              <View className="h-5 w-16 bg-slate-200 rounded-full" />
            </View>
          </View>
        ))}
      </View>

      {/* Action Button Placeholder */}
      <View className="w-full h-11 bg-slate-200 border-t border-slate-200" />
    </Animated.View>
  );
}
