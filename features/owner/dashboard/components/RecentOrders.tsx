import EmptyState from "@/components/reuseable/EmptyState";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RecentOrderRow from "./RecentOrderRow";

interface RecentOrdersProps {
  recentOrders: any[];
  isLoading: boolean;
}

export default function RecentOrders({ recentOrders = [], isLoading }: RecentOrdersProps) {
  if (isLoading) {
    return (
      <View className="gap-y-3">
        <Text className="text-base font-bold text-neutral">Recent Completed</Text>
        <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[120px] justify-center items-center">
          <Text className="text-xs text-accent">Loading transactions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View className="bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm">
        {/* Title Header */}
        <View className="p-4 pb-3 border-b border-base-200 flex-row justify-between items-center">
          <Text className="text-sm font-semibold text-neutral capitalize">Recent Completed Orders</Text>
        </View>
        {recentOrders.length === 0 ? (
          <EmptyState description="No recent completed transactions" pyClassName="py-8" />
        ) : (
          <View className="divide-y divide-base-200">
            {recentOrders.map((o: any, index: number) => (
              <RecentOrderRow key={o.id || index} order={o} index={index} />
            ))}
          </View>
        )}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/orders/todays-orders",
            })
          }
          className="w-full py-4 items-center justify-center border-t border-base-200"
        >
          <Text className="text-xs font-semibold text-primary capitalize">View Today's Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
