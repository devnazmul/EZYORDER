import Button from "@/components/reuseable/Button";
import EmptyState from "@/components/reuseable/EmptyState";
import { formatAmount } from "@/utils/formatters";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DriverOrder } from "../types";
import AssignedOrdersFeedSkeleton from "./skeletons/AssignedOrdersFeedSkeleton";

interface AssignedOrdersFeedProps {
  orders: DriverOrder[];
  isLoading: boolean;
  currencySymbol: string;
  onViewOrder: (order: DriverOrder) => void;
}

export default function AssignedOrdersFeed({
  orders,
  isLoading,
  currencySymbol,
  onViewOrder,
}: AssignedOrdersFeedProps) {
  if (isLoading) {
    return <AssignedOrdersFeedSkeleton />;
  }

  const getStatusColors = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "delivered" || s === "completed") {
      return { bg: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    }
    if (s === "cancelled" || s === "failed") {
      return { bg: "bg-rose-50 text-rose-700 border-rose-100" };
    }
    return { bg: "bg-amber-50 text-amber-700 border-amber-100" };
  };

  return (
    <View className="bg-base-300 p-4 rounded-lg flex-1">
      {/* Header */}
      <Text className="mb-4 font-bold capitalize opacity-80">My Assigned Orders</Text>

        {/* Orders List */}
        {orders.length === 0 ? (
          <EmptyState icon="inbox" description="No orders assigned yet." pyClassName="py-6" />
        ) : (
          <View className="flex-col gap-2.5">
            {orders.slice(0, 10).map((order) => {
              const statusColors = getStatusColors(order.status);
              const totalAmount = parseFloat(order.amount || order.total_due_amount || "0");

              return (
                <View
                  key={order.id}
                className="flex-row w-full items-center justify-between p-3 bg-base-100 border border-base-200/50 rounded-xl"
                >
                  <View className="flex-row items-center gap-3 flex-1 min-w-0">
                    <View className="w-9 h-9 bg-primary/10 rounded-lg items-center justify-center shrink-0">
                      <Text className="text-[10px] font-black text-primary uppercase">ID</Text>
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="font-bold text-slate-800 text-xs">{order.id}</Text>
                      <Text className="text-[10px] text-slate-400 font-bold mt-0.5 truncate pr-1">
                        {order.customer_name || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <View className="items-end">
                      <Text className="font-black text-slate-800 text-xs">
                        {formatAmount(totalAmount, currencySymbol)}
                      </Text>
                      <View className={`px-1.5 py-0.5 rounded-full border mt-1 ${statusColors.bg}`}>
                        <Text className="text-[8px] font-black uppercase tracking-wider">{order.status}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => onViewOrder(order)}
                      activeOpacity={0.8}
                      className="px-3.5 py-2 bg-slate-900 rounded-lg active:opacity-90 shrink-0"
                    >
                      <Text className="text-[9px] font-black text-white uppercase tracking-widest">View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

      <View className="mt-4">
        <Button label="View All Activity" onPress={() => {}} variant="secondary" />
      </View>
    </View>
  );
}
