import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface RevenueByOrderTypeCardProps {
  orderTypeData: any;
  netSales: number;
  currencySymbol: string;
  containerClassName?: string;
}

const getIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
  const norm = type.toLowerCase().replace("-", "_");
  if (norm.includes("delivery")) return "delivery-dining";
  if (norm.includes("eat_in") || norm.includes("dine_in")) return "restaurant";
  if (norm.includes("take_away") || norm.includes("takeaway")) return "takeout-dining";
  if (norm.includes("walk_in") || norm.includes("walkin")) return "person-add";
  return "shopping-bag";
};

const formatLabel = (type: string) => {
  return type.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function RevenueByOrderTypeCard({
  orderTypeData,
  netSales = 0,
  currencySymbol,
  containerClassName = "",
}: RevenueByOrderTypeCardProps) {

  const list = Array.isArray(orderTypeData) ? orderTypeData : [];

  return (
    <View
      className={`bg-base-300 border border-base-200 rounded-lg p-5 mb-6 shadow-sm ${containerClassName}`}
    >
      <Text className="text-md font-bold text-neutral mb-5">Revenue by Order Type</Text>

      <View className="gap-y-4">
        {list.length === 0 ? (
          <Text className="text-xs text-accent italic text-center py-4">No order data for this period.</Text>
        ) : (
          list.map((item: any, i: number) => {
            const val = Number(item.amount || item.value || 0);
            const percent = netSales > 0 ? Math.min(Math.round((val / netSales) * 100), 100) : 0;
            const label = formatLabel(item.order_type || "");
            const icon = getIcon(item.order_type || "");

            return (
              <View key={i} className="gap-y-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-2 items-center flex-1 min-w-0 mr-2">
                    <MaterialIcons name={icon} size={18} color="#6E6E6E" />
                    <Text className="text-xs font-bold text-neutral truncate" numberOfLines={1}>
                      {label}
                    </Text>
                  </View>
                  <Text className="text-xs font-bold text-neutral shrink-0">
                    {formatAmount(val, currencySymbol)} ({percent}%)
                  </Text>
                </View>

                <View className="h-2 w-full bg-base-200 rounded-full overflow-hidden">
                  <View style={{ width: `${percent}%` }} className="h-full bg-primary rounded-full" />
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
