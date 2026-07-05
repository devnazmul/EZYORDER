import React from "react";
import { Text, View } from "react-native";
import StatusBadge from "./reuseable/StatusBadge";
import Button from "./reuseable/Button";

interface OrderCardProps {
  item: any;
  onViewDetails: () => void;
}

export default function OrderCard({ item, onViewDetails }: OrderCardProps) {
  // Helper to extract items description
  const getOrderItemsText = (order: any) => {
    if (!order) return "";
    if (order.items_summary) return order.items_summary;
    const detailList = order.detail || order.details;
    if (Array.isArray(detailList) && detailList.length > 0) {
      return detailList
        .map((d: any) => `${d.qty || d.quantity || 1}x ${d.dish?.name || d.dish_name || "Item"}`)
        .join(", ");
    }
    return order.description || "";
  };

  // Helper to safely format time from string
  const getOrderTimeStr = (createdAtStr: string) => {
    if (!createdAtStr) return "--:--";
    const parts = createdAtStr.split(" ");
    if (parts.length > 1) {
      const timePart = parts[1]; // "18:23:25"
      if (timePart) {
        const timeSubParts = timePart.split(":");
        if (timeSubParts.length > 1) {
          return `${timeSubParts[0]}:${timeSubParts[1]}`; // "18:23"
        }
      }
    }
    return createdAtStr;
  };

  const orderTime = getOrderTimeStr(item.created_at);

  return (
    <View className="bg-base-300 rounded-xl border border-base-200 overflow-hidden shadow-sm mb-4">
      <View className="p-4 gap-y-3">
        <View className="flex-row justify-between items-start">
          <View className="gap-y-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-md font-bold text-neutral">#{item.id}</Text>
              <View className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                <Text className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">
                  {item.type || "Delivery"}
                </Text>
              </View>
            </View>
            <Text className="text-sm font-semibold text-neutral">
              {item.customer_name ||
                item.user?.first_Name ||
                (item.table_number && parseFloat(item.table_number) > 0
                  ? `Table ${parseFloat(item.table_number)}`
                  : "Walk-in Customer")}
            </Text>
          </View>

          <View className="items-end gap-y-1">
            <StatusBadge status={item.status} />
            <Text className="text-xs text-accent">{orderTime}</Text>
          </View>
        </View>

        {/* Items Summary bubble */}
        <View className="bg-base-100 rounded-lg p-3">
          <Text className="text-xs text-accent font-medium leading-4" numberOfLines={2}>
            {getOrderItemsText(item)}
          </Text>
        </View>

        {/* Price Row */}
        <View className="flex-row justify-between items-center pt-1">
          <Text className="text-md font-bold text-neutral">
            £{parseFloat(item.amount || item.final_price || "0").toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Button Action */}
      <View className="px-4 pb-4">
        <Button label="View Details" onPress={onViewDetails} variant="primary" />
      </View>
    </View>
  );
}
