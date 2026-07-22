import Button from "@/components/reuseable/Button";
import StatusBadge from "@/components/reuseable/StatusBadge";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { DriverOrder } from "../types";

interface DriverOrderFeedCardProps {
  order: DriverOrder;
  currencySymbol: string;
  onViewDetails: () => void;
}

export default function DriverOrderFeedCard({
  order,
  currencySymbol,
  onViewDetails,
}: DriverOrderFeedCardProps) {
  const orderDateTime = useMemo(() => {
    return order.created_at ? formatDateTime(order.created_at) : (order.order_time || "--:--");
  }, [order.created_at, order.order_time]);

  return (
    <View className="bg-base-300 rounded-xl border border-base-200 overflow-hidden shadow-sm mb-4">
      <View className="p-4 gap-y-3">
        <View className="flex-row justify-between items-start">
          <View className="gap-y-1 flex-1 pr-2">
            <Text className="text-md font-bold text-neutral">#{order.id}</Text>
            <Text className="text-[10px] text-accent font-medium mt-0.5">{orderDateTime}</Text>
          </View>

          <View className="items-end gap-y-1.5">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.payment_status} />
          </View>
        </View>

        {/* Price Row */}
        <View className="flex-row justify-between items-center border-t border-base-200/50 pt-2.5">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">Total Amount:</Text>
          <Text className="text-md font-bold text-neutral">
            {formatAmount(order.amount || order.total_due_amount || "0", currencySymbol)}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <View className="px-4 pb-4">
        <Button label="View Details" onPress={onViewDetails} variant="primary" />
      </View>
    </View>
  );
}
