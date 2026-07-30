import COLORS from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface SalesHourlyListProps {
  hourlyList: any[];
  currencySymbol: string;
}

export default function SalesHourlyList({ hourlyList, currencySymbol }: SalesHourlyListProps) {
  if (hourlyList.length === 0) {
    return (
      <Text
        style={{ fontSize: getResponsiveFontSize("xs"), paddingVertical: HP("5%") }}
        className="text-accent italic text-center"
      >
        No hourly activity recorded.
      </Text>
    );
  }

  const maxSales = Math.max(...hourlyList.map((h: any) => Number(h.sales || 0)), 1);

  return (
    <View className="flex flex-col gap-3 pb-6">
      {hourlyList.map((row: any, i: number) => {
        const salesVal = Number(row.sales);
        const percent = maxSales > 0 ? Math.min(Math.round((salesVal / maxSales) * 100), 100) : 0;
        return (
          <View
            key={i}
            style={{ padding: WP("3%") }}
            className="bg-base-300 border border-base-200 rounded-lg"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row gap-2 items-center">
                <MaterialIcons name="access-time" size={WP("4%")} color={COLORS.primary} />
                <Text
                  style={{ fontSize: getResponsiveFontSize("sm") }}
                  className="font-semibold text-neutral"
                >
                  {row.hour}
                </Text>
              </View>
              <View className="items-end">
                <Text
                  style={{ fontSize: getResponsiveFontSize("sm") }}
                  className="font-semibold text-neutral"
                >
                  {formatAmount(salesVal, currencySymbol)}
                </Text>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-accent font-semibold">
                  {row.orders} {row.orders === 1 ? "Order" : "Orders"}
                </Text>
              </View>
            </View>
            <View style={{ height: HP("0.8%") }} className="w-full bg-base-200 rounded-full overflow-hidden">
              <View style={{ width: `${percent}%` }} className="h-full bg-primary rounded-full" />
            </View>
          </View>
        );
      })}
    </View>
  );
}
