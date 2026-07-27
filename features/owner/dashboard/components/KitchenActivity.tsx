import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import KitchenActivitySkeleton from "./skeletons/KitchenActivitySkeleton";

interface KitchenActivityProps {
  kitchenActivity: any;
  isLoading: boolean;
}

export default function KitchenActivity({ kitchenActivity = {}, isLoading }: KitchenActivityProps) {
  if (isLoading) {
    return <KitchenActivitySkeleton />;
  }

  return (
    <View key="loaded" className="bg-neutral p-5 rounded-2xl mb-6 shadow-md">
      <View className="flex-row items-center gap-2 pb-3 border-b border-white/10 mb-4">
        <MaterialIcons name="restaurant-menu" size={20} color="#F97316" />
        <Text className="text-sm font-semibold text-white capitalize">Kitchen Activity</Text>
      </View>

      <View className="gap-y-4">
        {/* Row 1: Waiting Orders & Delayed */}
        <View className="flex-row items-center border-b border-white/10 pb-3">
          <View className="flex-1 flex-row items-center justify-between pr-3">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="pending-actions" size={16} color="rgba(255, 255, 255, 0.4)" />
              <Text className="text-xs text-accent font-medium capitalize">Waiting Orders</Text>
            </View>
            <Text className="text-lg font-bold text-white">{kitchenActivity?.waiting || 0}</Text>
          </View>

          <View className="w-[1px] h-6 bg-white/10" />

          <View className="flex-1 flex-row items-center justify-between pl-3">
            <View className="flex-row items-center gap-1.5">
              <AntDesign name="warning" size={16} color="rgba(220, 45, 42, 0.6)" />
              <Text className="text-xs text-accent font-medium capitalize">Delayed</Text>
            </View>
            <Text className="text-lg font-bold text-primary">{kitchenActivity?.delayed || 0}</Text>
          </View>
        </View>

        {/* Row 2: Avg Prep Time */}
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons name="clock-fast" size={16} color="rgba(255, 255, 255, 0.4)" />
            <Text className="text-xs text-accent font-medium capitalize">Avg Prep Time</Text>
          </View>
          <Text className="text-lg font-bold text-green-400">{kitchenActivity?.avgPrep || "00:00"}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/orders/kitchen-screen")}
        activeOpacity={0.7}
        className="w-full mt-5 bg-white/10 py-3 rounded-lg flex-row items-center justify-center gap-2"
      >
        <MaterialIcons name="visibility" size={18} color="white" />
        <Text className="text-white font-semibold text-xs capitalize">Open Kitchen View</Text>
      </TouchableOpacity>
    </View>
  );
}
