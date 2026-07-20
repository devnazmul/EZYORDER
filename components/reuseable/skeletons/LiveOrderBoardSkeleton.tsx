import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function LiveOrderBoardSkeleton() {
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
    <Animated.View style={{ opacity: pulse }} className="gap-y-2">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className="bg-slate-100 border border-slate-200/50 p-4 flex-row justify-between items-center rounded-xl h-[56px]"
        >
          {/* Label Placeholder */}
          <View className="h-3 w-28 bg-slate-200 rounded" />

          {/* Circle/Badge Placeholder */}
          <View className="w-6 h-6 rounded-full bg-slate-200" />
        </View>
      ))}
    </Animated.View>
  );
}
