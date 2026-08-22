import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export default function PickupDetailsSkeleton() {
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
    <View key="pickup-loading" className="gap-y-2 mb-4">
      <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
        Pickup Details
      </Text>
      <Animated.View style={{ opacity: pulseAnim }}>
        <View className="bg-slate-50 rounded-lg p-3.5 gap-y-3 border border-base-200 shadow-sm">
          <View className="flex-row justify-between items-center">
            <View className="h-3 w-20 bg-slate-200 rounded" />
            <View className="h-3.5 w-32 bg-slate-200 rounded" />
          </View>
          <View className="flex-row justify-between items-center">
            <View className="h-3 w-16 bg-slate-200 rounded" />
            <View className="h-3.5 w-36 bg-slate-200 rounded" />
          </View>
          <View className="flex-row justify-between items-center">
            <View className="h-3 w-16 bg-slate-200 rounded" />
            <View className="h-3.5 w-28 bg-slate-200 rounded" />
          </View>
          <View className="flex-row justify-between items-start">
            <View className="h-3 w-16 bg-slate-200 rounded" />
            <View className="h-3.5 w-44 bg-slate-200 rounded" />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
