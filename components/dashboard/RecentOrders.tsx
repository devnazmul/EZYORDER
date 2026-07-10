import { useAuth } from "@/context/AuthContext";
import { useDashboardRecentOrders } from "@/hooks/useDashboardQueries";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EmptyState from "../reuseable/EmptyState";
import RecentOrderRow from "./RecentOrderRow";

export default function RecentOrders() {
  const { token } = useAuth();
  const { data: recentOrders = [], isLoading } = useDashboardRecentOrders(token || "");

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
    <View className="gap-y-3">
      <Text className="text-base font-bold text-neutral">Recent Completed</Text>
      <View className="bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm">
        {recentOrders.length === 0 ? (
          <EmptyState description="No recent completed transactions" pyClassName="py-8" />
        ) : (
          <View className="divide-y divide-base-200">
            {recentOrders.map((o: any, index: number) => (
              <RecentOrderRow key={o.id || index} order={o} index={index} />
            ))}
          </View>
        )}
        <TouchableOpacity className="w-full py-4 items-center justify-center border-t border-base-200">
          <Text className="text-xs font-bold text-primary uppercase">VIEW ALL HISTORY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
