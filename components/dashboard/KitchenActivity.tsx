import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface KitchenActivityProps {
  kitchenActivity: any;
  isLoading: boolean;
}

export default function KitchenActivity({ kitchenActivity = {}, isLoading }: KitchenActivityProps) {

  if (isLoading) {
    return (
      <View
        key="loading"
        className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[160px] justify-center items-center"
      >
        <Text className="text-xs text-accent">Loading kitchen activity...</Text>
      </View>
    );
  }

  return (
    <View key="loaded" className="bg-neutral p-5 rounded-2xl mb-6 shadow-md">
      <View className="flex-row justify-between items-center pb-3 border-b border-white/10 mb-4">
        <Text className="text-sm font-semibold text-white capitalize">Kitchen Activity</Text>
        <MaterialIcons name="local-fire-department" size={22} color="#DC2D2A" />
      </View>
      <View className="gap-y-4">
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <Text className="text-xs text-accent font-medium capitalize">Waiting Orders</Text>
          <Text className="text-lg font-bold text-white">{kitchenActivity?.waiting || 0}</Text>
        </View>
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <Text className="text-xs text-accent font-medium capitalize">Avg Prep Time</Text>
          <Text className="text-lg font-bold text-green-400">{kitchenActivity?.avgPrep || "00:00"}</Text>
        </View>
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <Text className="text-xs text-accent font-medium capitalize">Delayed</Text>
          <Text className="text-lg font-bold text-primary">{kitchenActivity?.delayed || 0}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/orders/kitchen-screen")}
        className="w-full mt-5 bg-white/10 py-3 rounded-lg flex-row items-center justify-center gap-2"
      >
        <MaterialIcons name="visibility" size={18} color="white" />
        <Text className="text-white font-semibold text-xs capitalize">Open Kitchen View</Text>
      </TouchableOpacity>
    </View>
  );
}
