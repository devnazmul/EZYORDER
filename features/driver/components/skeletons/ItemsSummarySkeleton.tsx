import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function ItemsSummarySkeleton() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
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
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <Animated.View key="items-loading" style={{ opacity: pulseAnim }} className="gap-2.5">
      {[1, 2].map((i) => (
        <View key={i} className="bg-slate-50/50 border border-slate-100 rounded-lg p-3">
          <View className="flex-row justify-between items-start">
            {/* Item title placeholder */}
            <View className="h-3.5 w-1/2 bg-slate-200 rounded" />
            {/* Price placeholder */}
            <View className="h-3.5 w-12 bg-slate-200 rounded" />
          </View>
          <View className="flex-row justify-between items-center mt-3 pt-2.5 border-t border-slate-200/40">
            {/* Quantity placeholder */}
            <View className="h-3 w-20 bg-slate-200 rounded" />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}
