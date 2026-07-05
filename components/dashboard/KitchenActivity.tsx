import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useDashboardKitchenActivity } from "@/hooks/useDashboardQueries";

export default function KitchenActivity() {
  const { token } = useAuth();
  const { data: kitchenActivity = {}, isLoading } = useDashboardKitchenActivity(token || "");

  if (isLoading) {
    return (
      <View key="loading" className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[160px] justify-center items-center">
        <Text className="text-xs text-accent">Loading kitchen activity...</Text>
      </View>
    );
  }

  return (
    <View key="loaded" className="bg-neutral p-5 rounded-2xl mb-6 shadow-md">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-white">Kitchen Activity</Text>
        <MaterialIcons name="local-fire-department" size={22} color="#DC2D2A" />
      </View>
      <View className="gap-y-4">
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <Text className="text-xs text-accent font-medium uppercase">WAITING ORDERS</Text>
          <Text className="text-lg font-bold text-white">{kitchenActivity?.waiting || 0}</Text>
        </View>
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <Text className="text-xs text-accent font-medium uppercase">AVG PREP TIME</Text>
          <Text className="text-lg font-bold text-green-400">{kitchenActivity?.avgPrep || "00:00"}</Text>
        </View>
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <Text className="text-xs text-accent font-medium uppercase">DELAYED</Text>
          <Text className="text-lg font-bold text-primary">{kitchenActivity?.delayed || 0}</Text>
        </View>
      </View>
      <TouchableOpacity className="w-full mt-5 bg-white/10 py-3 rounded-lg flex-row items-center justify-center gap-2">
        <MaterialIcons name="visibility" size={18} color="white" />
        <Text className="text-white font-bold text-xs">OPEN KITCHEN VIEW</Text>
      </TouchableOpacity>
    </View>
  );
}
