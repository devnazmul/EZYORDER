import { formatAmount } from "@/utils/formatters";
import React from "react";
import { Text, View } from "react-native";
import StatusBadge from "./reuseable/StatusBadge";

interface RecentOrderRowProps {
  order: any;
  index: number;
}

export default function RecentOrderRow({ order, index }: RecentOrderRowProps) {
  const customerName =
    order.customer_name ||
    order.user?.first_Name ||
    (order.table_number && parseFloat(order.table_number) > 0
      ? `Table ${parseFloat(order.table_number)}`
      : "Walk-in Customer");

  const orderPrice = order.amount || order.final_price || "0.00";

  return (
    <View className="p-4 flex-row items-center justify-between">
      <View>
        <Text className="text-xs font-bold text-neutral">#{order.id}</Text>
        <Text className="text-[9px] text-accent uppercase font-bold mt-1">
          {customerName} • {order.type || "Order"}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        <Text className="text-xs font-bold text-neutral">{formatAmount(orderPrice)}</Text>
        <StatusBadge status={order.status} />
      </View>
    </View>
  );
}
