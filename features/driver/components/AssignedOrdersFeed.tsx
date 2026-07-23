import Badge from "@/components/reuseable/Badge";
import EmptyState from "@/components/reuseable/EmptyState";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { router } from "expo-router";
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

const getStatusBadgeStyles = (status: string) => {
  const s = (status || "").toLowerCase().trim();
  if (s === "completed" || s === "complete" || s === "delivered" || s === "paid" || s === "active") {
    return {
      container: "bg-green-50 border border-green-100",
      text: "text-green-700",
    };
  }
  if (s === "cancelled" || s === "failed" || s === "expired") {
    return {
      container: "bg-red-50 border border-red-100",
      text: "text-red-700",
    };
  }
  if (s === "unpaid") {
    return {
      container: "bg-pink-50 border border-pink-100",
      text: "text-pink-700",
    };
  }
  return {
    container: "bg-orange-50 border border-orange-100",
    text: "text-orange-700",
  };
};

export default function AssignedOrdersFeed({
  orders,
  isLoading,
  currencySymbol,
  onViewOrder,
}: AssignedOrdersFeedProps) {
  if (isLoading) {
    return <AssignedOrdersFeedSkeleton />;
  }

  return (
    <View className="bg-base-300 rounded-3xl overflow-hidden border border-base-200 shadow-sm">
      <View className="p-4 pb-2">
        <Text className="text-sm font-bold text-neutral">My Assigned Orders</Text>
      </View>
      {orders.length === 0 ? (
        <View className="border-t border-base-200">
          <EmptyState icon="inbox" description="No orders assigned yet." pyClassName="py-8" />
        </View>
      ) : (
        <View className="divide-y divide-base-200 border-t border-base-200">
          {orders.slice(0, 5).map((order, index) => {
            const totalAmount = parseFloat(order.amount || order.total_due_amount || "0");
            const orderTime = order.created_at ? formatDateTime(order.created_at) : order.order_time || "";
            const badgeStyles = getStatusBadgeStyles(order.status);

            return (
              <TouchableOpacity
                key={order.id || index}
                onPress={() => onViewOrder(order)}
                activeOpacity={0.7}
                className="p-4 flex-row items-center justify-between"
              >
                <View className="flex-1 mr-4">
                  <Text className="text-xs font-bold text-neutral">#{order.id}</Text>
                  <Text className="text-[9px] text-accent capitalize font-bold mt-1">
                    {order.customer_name || "N/A"} •{" "}
                    {order.type
                      ? order.type.charAt(0).toUpperCase() + order.type.slice(1).toLowerCase()
                      : "Order"}
                    {orderTime ? ` • ${orderTime}` : ""}
                  </Text>
                </View>
                <View className="flex-row items-center gap-4">
                  <Text className="text-xs font-bold text-neutral">
                    {formatAmount(totalAmount, currencySymbol)}
                  </Text>
                  <Badge
                    text={order.status}
                    containerClassName={badgeStyles.container}
                    textClassName={badgeStyles.text}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          router.push({ pathname: "/(driver)/my-orders" });
        }}
        className="w-full bg-primary py-4 items-center justify-center border-t border-base-200"
      >
        <Text className="text-xs text-white font-bold text-primary capitalize">View All Orders</Text>
      </TouchableOpacity>
    </View>
  );
}
