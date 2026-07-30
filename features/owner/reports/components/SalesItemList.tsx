import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { Text, View } from "react-native";

interface SalesItemListProps {
  itemList: any[];
  currencySymbol: string;
}

export default function SalesItemList({ itemList, currencySymbol }: SalesItemListProps) {
  if (itemList.length === 0) {
    return (
      <Text
        style={{ fontSize: getResponsiveFontSize("xs"), paddingVertical: HP("5%") }}
        className="text-accent italic text-center"
      >
        No items sold in this period.
      </Text>
    );
  }

  return (
    <View className="flex flex-col gap-3 pb-6">
      {itemList.map((row: any, i: number) => (
        <View
          key={i}
          style={{ padding: WP("4%") }}
          className="bg-base-300 border border-base-200 rounded-lg flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3 flex-1 min-w-0">
            <View className="rounded-lg px-3 py-1 bg-primary/10 items-center justify-center">
              <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-primary">
                {i + 1}
              </Text>
            </View>
            <View className="flex-1 min-w-0">
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className="font-semibold text-neutral truncate"
                numberOfLines={1}
              >
                {row.item_name}
              </Text>
              <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-accent font-semibold">
                Sold: {Number(row.quantity_sold)}
              </Text>
            </View>
          </View>
          <View className="items-end ml-2">
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              {formatAmount(row.net_sales, currencySymbol)}
            </Text>
            <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-primary font-semibold">
              Discount: {formatAmount(row.discounts, currencySymbol)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
