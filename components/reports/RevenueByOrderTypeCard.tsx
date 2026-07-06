import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

export interface OrderTypeDataPoint {
  key: string;
  label: string;
  value: number;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface RevenueByOrderTypeCardProps {
  orderTypeData: any;
  netSales: number;
  containerClassName?: string;
}

export default function RevenueByOrderTypeCard({
  orderTypeData,
  netSales = 0,
  containerClassName = "",
}: RevenueByOrderTypeCardProps) {
  // Parse order types internally
  const orderTypesSummary = useMemo(() => {
    const defaults = [
      { key: "delivery", label: "Delivery", value: 0, icon: "delivery-dining" as const },
      { key: "eat_in", label: "Eat In", value: 0, icon: "restaurant" as const },
      { key: "take_away", label: "Take Away", value: 0, icon: "takeout-dining" as const },
      { key: "walk_in", label: "Walk In", value: 0, icon: "person-add" as const },
    ];

    if (!orderTypeData || !Array.isArray(orderTypeData)) return defaults;

    return defaults.map((def) => {
      const matched = orderTypeData.find(
        (item: any) =>
          item.order_type === def.key ||
          item.order_type === def.key.replace("_", "-") ||
          item.order_type === def.key.replace("-", "_")
      );
      return {
        ...def,
        value: matched ? parseFloat(matched.amount) || 0 : 0,
      };
    });
  }, [orderTypeData]);

  return (
    <View
      className={`bg-base-300 border border-base-200 rounded-lg p-5 mb-6 shadow-sm ${containerClassName}`}
    >
      <Text className="text-md font-bold text-neutral mb-5">Revenue by Order Type</Text>

      <View className="gap-y-4">
        {orderTypesSummary.map((item) => {
          // Calculate percentage based on netSales
          const percent = netSales > 0 ? Math.min(Math.round((item.value / netSales) * 100), 100) : 0;

          return (
            <View key={item.key} className="gap-y-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2 items-center">
                  <MaterialIcons name={item.icon} size={18} color="#6E6E6E" />
                  <Text className="text-xs font-bold text-neutral ">{item.label} </Text>
                </View>
                <Text className="text-xs font-bold text-neutral">
                  $
                  {item.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ({percent}%)
                </Text>
              </View>

              {/* Progress bar line */}
              <View className="h-2 w-full bg-base-200 rounded-full overflow-hidden">
                <View style={{ width: `${percent}%` }} className="h-full bg-primary rounded-full" />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
