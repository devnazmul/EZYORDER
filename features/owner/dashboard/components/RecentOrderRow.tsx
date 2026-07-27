import StatusBadge from "@/components/reuseable/StatusBadge";
import { useData } from "@/context/context/DataContext";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

interface RecentOrderRowProps {
  order: any;
  index: number;
}

export default function RecentOrderRow({ order, index }: RecentOrderRowProps) {
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const customerName = order.customer;

  const formattedPrice = formatAmount(order.price, currencySymbol);

  const orderTime = useMemo(() => {
    if (order.created_at) {
      return formatDateTime(order.created_at);
    }
    return order.time || "";
  }, [order.created_at, order.time]);

  return (
    <View className="p-4 flex-row items-center justify-between">
      <View className="flex-1 mr-4">
        <Text className="text-xs font-bold text-neutral">#{order.id}</Text>
        <Text className="text-[9px] text-accent capitalize font-semibold mt-1">
          {customerName} • {order.type || "Order"}
          {orderTime ? ` • ${orderTime}` : ""}
        </Text>
        {order.items ? (
          <Text className="text-[10px] text-accent/80 font-medium mt-0.5 truncate" numberOfLines={1}>
            {order.items}
          </Text>
        ) : null}
      </View>
      <View className="flex-row items-center gap-4">
        <Text className="text-xs font-bold text-neutral">{formattedPrice}</Text>
        <StatusBadge status={order.status} />
      </View>
    </View>
  );
}
