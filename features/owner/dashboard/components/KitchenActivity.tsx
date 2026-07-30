import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
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
    <View
      key="loaded"
      style={{ padding: WP("4%") }}
      className="bg-neutral rounded-2xl shadow-md"
    >
      <View className="flex-row items-center gap-2 pb-3 border-b border-white/10 mb-4">
        <MaterialIcons name="restaurant-menu" size={20} color="#F97316" />
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="font-semibold text-white capitalize"
        >
          Kitchen Activity
        </Text>
      </View>

      <View className="gap-y-3">
        {/* Row 1: Waiting Orders & Delayed */}
        <View className="flex-row items-center border-b border-white/10 pb-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/orders/todays-orders",
                params: {
                  tab: "eat_in,delivery,take_away,walk_in",
                  status: "pending",
                },
              })
            }
            className="flex-1 flex-row items-center justify-between pr-3"
          >
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="pending-actions" size={WP("3.75%")} color="rgba(255, 255, 255, 0.4)" />
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className="text-accent font-medium capitalize"
              >
                Waiting Orders
              </Text>
            </View>
            <Text style={{ fontSize: getResponsiveFontSize("lg") }} className="font-bold text-white">
              {kitchenActivity?.waiting || 0}
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-6 bg-white/10" />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/orders/todays-orders",
                params: {
                  tab: "eat_in,delivery,take_away,walk_in",
                  is_delay: "1",
                },
              })
            }
            className="flex-1 flex-row items-center justify-between pl-3"
          >
            <View className="flex-row items-center gap-1.5">
              <AntDesign name="warning" size={WP("3.75%")} color="rgba(220, 45, 42, 0.6)" />
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className="text-accent font-medium capitalize"
              >
                Delayed
              </Text>
            </View>
            <Text style={{ fontSize: getResponsiveFontSize("lg") }} className="font-bold text-primary">
              {kitchenActivity?.delayed || 0}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Avg Prep Time */}
        <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
          <View className="flex-row items-center gap-1.5">
            <MaterialCommunityIcons name="clock-fast" size={WP("3.75%")} color="rgba(255, 255, 255, 0.4)" />
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="text-accent font-medium capitalize"
            >
              Avg Prep Time
            </Text>
          </View>
          <Text style={{ fontSize: getResponsiveFontSize("lg") }} className="font-bold text-green-400">
            {kitchenActivity?.avgPrep || "00:00"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/orders/kitchen-screen")}
        activeOpacity={0.7}
        className="w-full bg-white/10 rounded-lg flex-row items-center justify-center gap-2 py-3 mt-4"
      >
        <MaterialIcons name="visibility" size={18} color="white" />
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="text-white font-semibold capitalize"
        >
          Open Kitchen View
        </Text>
      </TouchableOpacity>
    </View>
  );
}
