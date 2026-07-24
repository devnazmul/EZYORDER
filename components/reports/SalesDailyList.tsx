import { formatAmount } from "@/utils/formatters";
import React from "react";
import { Text, View } from "react-native";

interface SalesDailyListProps {
  dailyList: any[];
  currencySymbol: string;
}

export default function SalesDailyList({ dailyList, currencySymbol }: SalesDailyListProps) {
  if (dailyList.length === 0) {
    return (
      <Text className="text-xs text-accent italic text-center py-10">
        No transactions recorded for this period.
      </Text>
    );
  }

  return (
    <View>
      {dailyList.map((row: any, i: number) => (
        <View key={i} className="bg-base-300 border border-base-200 rounded-lg p-4 mb-3">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xs font-black text-neutral">{row.date}</Text>
            <View className="bg-primary/10 px-2.5 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-primary">
                {row.orders} {row.orders === 1 ? "Order" : "Orders"}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-[9px] text-accent font-bold uppercase mb-0.5">Net Sales</Text>
              <Text className="text-xs font-black text-neutral">
                {formatAmount(row.net_sales, currencySymbol)}
              </Text>
            </View>
            <View>
              <Text className="text-[9px] text-accent font-bold uppercase mb-0.5">Cash</Text>
              <Text className="text-xs font-bold text-neutral">{formatAmount(row.cash, currencySymbol)}</Text>
            </View>
            <View>
              <Text className="text-[9px] text-accent font-bold uppercase mb-0.5">Card</Text>
              <Text className="text-xs font-bold text-neutral">{formatAmount(row.card, currencySymbol)}</Text>
            </View>
            <View>
              <Text className="text-[9px] text-accent font-bold uppercase mb-0.5">Discount</Text>
              <Text className="text-xs font-bold text-error">
                {formatAmount(row.discounts, currencySymbol)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
