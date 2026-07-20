import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function AssignedOrdersFeedSkeleton() {
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 900,
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
      className="bg-base-300 p-4 rounded-lg flex-1"
    >
      {/* Header Placeholder */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="h-4 w-32 bg-slate-200 rounded" />
        <View className="w-2.5 h-2.5 rounded-full bg-slate-200" />
      </View>

      {/* Rows Placeholder */}
      <View className="flex-col gap-2.5">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className="flex-row w-full items-center justify-between p-3 bg-base-100 border border-base-200/50 rounded-xl h-[60px]"
          >
            <View className="flex-row items-center gap-3 flex-1">
              {/* ID placeholder */}
              <View className="w-9 h-9 bg-slate-200 rounded-lg shrink-0" />
              {/* Info placeholders */}
              <View className="flex-col gap-1.5 flex-1">
                <View className="h-3 w-16 bg-slate-200 rounded" />
                <View className="h-2.5 w-24 bg-slate-200 rounded" />
              </View>
            </View>
            {/* Right side placeholder */}
            <View className="flex-row items-center gap-3 shrink-0">
              <View className="items-end gap-1">
                <View className="h-3 w-12 bg-slate-200 rounded" />
                <View className="h-2.5 w-10 bg-slate-200 rounded-full" />
              </View>
              <View className="w-14 h-8 bg-slate-200 rounded-lg" />
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
