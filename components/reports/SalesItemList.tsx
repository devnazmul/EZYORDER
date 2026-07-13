import { formatAmount } from "@/utils/formatters";
import React from "react";
import { Text, View } from "react-native";

interface SalesItemListProps {
  itemList: any[];
  currencySymbol: string;
}

export default function SalesItemList({ itemList, currencySymbol }: SalesItemListProps) {
  if (itemList.length === 0) {
    return (
      <Text className="text-xs text-accent italic text-center py-10">No items sold in this period.</Text>
    );
  }

  return (
    <View>
      {itemList.map((row: any, i: number) => (
        <View
          key={i}
          className="bg-base-300 border border-base-200 rounded-lg p-4 mb-3 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3 flex-1 min-w-0">
            <View className="w-5 h-5 rounded-full bg-primary/10 items-center justify-center">
              <Text className="text-[10px] font-black text-primary">{i + 1}</Text>
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-xs font-bold text-neutral truncate" numberOfLines={1}>
                {row.item_name}
              </Text>
              <Text className="text-[10px] text-accent font-semibold">Sold: {Number(row.quantity_sold)}</Text>
            </View>
          </View>
          <View className="items-end ml-2">
            <Text className="text-xs font-black text-neutral">
              {formatAmount(row.net_sales, currencySymbol)}
            </Text>
            <Text className="text-[10px] text-error font-semibold">
              Discount: {formatAmount(row.discounts, currencySymbol)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
