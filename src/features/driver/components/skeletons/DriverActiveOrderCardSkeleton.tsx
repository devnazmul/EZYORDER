import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function DriverActiveOrderCardSkeleton() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
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
      className="w-full p-4 bg-slate-100 border border-slate-200/50 rounded-2xl shadow-sm mb-2 flex-col gap-6 overflow-hidden"
    >
      {/* Header showing Order ID */}
      <View className="flex-row justify-between items-center pb-3 border-b border-slate-200/40">
        <View className="gap-y-1">
          <View className="h-3 w-16 bg-slate-200 rounded" />
          <View className="h-5 w-24 mt-1 bg-slate-200 rounded" />
        </View>
        <View className="w-16 h-7 rounded-full bg-slate-200" />
      </View>

      {/* Steps Progress Tracker */}
      <View className="">
        <View className="flex-row justify-between items-center mb-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} className="items-center flex-1">
              <View className="w-8 h-8 rounded-full bg-slate-200" />
              <View className="h-2.5 w-10 mt-2 bg-slate-200 rounded" />
            </View>
          ))}
        </View>
        <View className="w-full h-14 rounded-lg bg-slate-200" />
      </View>

      {/* From and To sections */}
      <View className="flex-row items-start justify-between border-t border-neutral/5 pt-4 pr-6">
        {/* From Section */}
        <View className="gap-y-1">
          <View className="h-3 w-12 mb-1 bg-slate-200 rounded" />
          <View className="h-4 w-28 bg-slate-200 rounded" />
        </View>

        {/* To Section */}
        <View className="gap-y-1">
          <View className="h-3 w-8 mb-1 bg-slate-200 rounded" />
          <View className="h-4 w-36 bg-slate-200 rounded" />
        </View>
      </View>

      {/* Customer, Amount, Payment sections */}
      <View className="flex-row items-start justify-between border-b border-neutral/5 pb-4 pr-6">
        {/* Customer Section */}
        <View className="gap-y-1">
          <View className="h-3 w-16 mb-1 bg-slate-200 rounded" />
          <View className="h-4 w-24 bg-slate-200 rounded" />
          <View className="h-3 w-20 mt-1 bg-slate-200 rounded" />
        </View>

        {/* Amount Section */}
        <View className="gap-y-1">
          <View className="h-3 w-14 mb-1 bg-slate-200 rounded" />
          <View className="h-4 w-16 bg-slate-200 rounded" />
        </View>

        {/* Payment Status Section */}
        <View className="gap-y-1">
          <View className="h-3 w-14 mb-1 bg-slate-200 rounded" />
          <View className="w-16 h-6 rounded-full bg-slate-200" />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <View className="flex-1 h-10 rounded-lg bg-slate-200" />
        <View className="flex-1 h-10 rounded-lg bg-slate-200" />
      </View>
    </Animated.View>
  );
}
