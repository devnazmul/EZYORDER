import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface SalesHourlyListProps {
  hourlyList: any[];
  currencySymbol: string;
}

export default function SalesHourlyList({ hourlyList, currencySymbol }: SalesHourlyListProps) {
  if (hourlyList.length === 0) {
    return <Text className="text-xs text-accent italic text-center py-10">No hourly activity recorded.</Text>;
  }

  const maxSales = Math.max(...hourlyList.map((h: any) => Number(h.sales || 0)), 1);

  return (
    <View>
      {hourlyList.map((row: any, i: number) => {
        const salesVal = Number(row.sales);
        const percent = maxSales > 0 ? Math.min(Math.round((salesVal / maxSales) * 100), 100) : 0;
        return (
          <View key={i} className="bg-base-300 border border-base-200 rounded-lg p-4 mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row gap-2 items-center">
                <MaterialIcons name="access-time" size={14} color="#6E6E6E" />
                <Text className="text-xs font-bold text-neutral">{row.hour}</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs font-black text-neutral">
                  {formatAmount(salesVal, currencySymbol)}
                </Text>
                <Text className="text-[9px] text-accent font-bold">
                  {row.orders} {row.orders === 1 ? "Order" : "Orders"}
                </Text>
              </View>
            </View>
            <View className="h-1.5 w-full bg-base-200 rounded-full overflow-hidden">
              <View style={{ width: `${percent}%` }} className="h-full bg-primary rounded-full" />
            </View>
          </View>
        );
      })}
    </View>
  );
}
