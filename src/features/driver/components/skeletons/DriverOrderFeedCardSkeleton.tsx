import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function DriverOrderFeedCardSkeleton() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{ opacity: pulse }}
      className="bg-base-300 rounded-xl border border-base-200 overflow-hidden shadow-sm mb-4"
    >
      <View className="p-4 gap-y-3">
        <View className="flex-row justify-between items-start">
          <View className="gap-y-1.5 flex-1 pr-2">
            {/* ID placeholder */}
            <View className="h-4 w-20 bg-slate-200 rounded" />
            {/* Date placeholder */}
            <View className="h-3 w-32 bg-slate-200 rounded mt-1" />
          </View>

          <View className="items-end gap-y-1.5">
            {/* Badges placeholder */}
            <View className="w-16 h-5 rounded-full bg-slate-200" />
            <View className="w-16 h-5 rounded-full bg-slate-200" />
          </View>
        </View>

        {/* Price Row */}
        <View className="flex-row justify-between items-center border-t border-base-200/50 pt-2.5">
          <View className="h-3 w-20 bg-slate-200 rounded" />
          <View className="h-4 w-12 bg-slate-200 rounded" />
        </View>
      </View>

      {/* Action Button */}
      <View className="px-4 pb-4">
        <View className="w-full h-10 rounded-lg bg-slate-200" />
      </View>
    </Animated.View>
  );
}
