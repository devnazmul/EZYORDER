import Badge from "@/components/reuseable/Badge";
import EmptyState from "@/components/reuseable/EmptyState";
import { formatLabel } from "@/utils/formatLabel";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { getStatusBadgeConfig } from "@/utils/getStatusBadgeConfig";
import { MaterialIcons } from "@expo/vector-icons";
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
    <View className="bg-base-300 rounded-3xl overflow-hidden  shadow-sm">
      <View className="p-4 pb-2">
        <Text className="text-sm font-bold text-neutral">My Assigned Orders</Text>
      </View>
      {orders.length === 0 ? (
        <View>
          <EmptyState icon="inbox" description="No orders assigned yet." pyClassName="py-8" />
        </View>
      ) : (
        <View className="divide-y divide-base-200 ">
          {orders.slice(0, 5).map((order, index) => {
            const totalAmount = parseFloat(order.amount || order.total_due_amount || "0");
            const orderTime = order.created_at ? formatDateTime(order.created_at) : order.order_time || "";
            const statusConfig = getStatusBadgeConfig(order.status);

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
                <View className="flex-row items-center gap-3">
                  <Text className="text-xs font-bold text-neutral">
                    {formatAmount(totalAmount, currencySymbol)}
                  </Text>
                  <Badge
                    text={formatLabel(order.status) || "Pending"}
                    icon={
                      <MaterialIcons name={statusConfig.iconName} size={12} color={statusConfig.iconColor} />
                    }
                    iconPosition="left"
                    containerClassName={statusConfig.containerClass}
                    textClassName={statusConfig.textClass}
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
