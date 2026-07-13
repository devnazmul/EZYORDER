import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopProductsListProps {
  itemList: any[];
  currencySymbol: string;
  isLoading?: boolean;
  onNavigateToTab: (tab: string) => void;
}

export default function TopProductsList({
  itemList,
  currencySymbol,
  isLoading = false,
  onNavigateToTab,
}: TopProductsListProps) {

  const totalItemSales = itemList?.reduce((acc, item) => acc + Number(item.net_sales || 0), 0) || 0;
  const displayList = itemList && itemList.length > 0 ? itemList.slice(0, 5) : [];

  return (
    <View className="bg-base-300 border border-base-200 rounded-lg p-5 mb-6 shadow-sm">
      <Text className="text-md font-bold text-neutral mb-5">Top Selling Products</Text>

      <View className="gap-y-3">
        {displayList.length === 0 ? (
          <Text className="text-xs text-accent italic text-center py-4">No items sold in this period.</Text>
        ) : (
          displayList.map((item, idx) => {
            const salesPct =
              item.percent ||
              (totalItemSales > 0
                ? `${((Number(item.net_sales || 0) / totalItemSales) * 100).toFixed(1)}%`
                : "0.0%");

            return (
              <View
                key={idx}
                className="flex-row items-center justify-between p-3 border border-base-200 rounded-lg bg-base-100/50"
              >
                <View className="flex-row items-center gap-3 flex-1 min-w-0">
                  <View className="w-5 h-5 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="text-[10px] font-black text-primary">{idx + 1}</Text>
                  </View>

                  <View className="flex-1 min-w-0">
                    <Text className="text-xs font-bold text-neutral truncate" numberOfLines={1}>
                      {item.item_name}
                    </Text>
                    <Text className="text-[10px] text-accent font-semibold">
                      Qty Sold: {Number(item.quantity_sold)}
                    </Text>
                  </View>
                </View>

                <View className="items-end ml-2">
                  <Text className="text-xs font-black text-neutral">
                    {formatAmount(item.net_sales, currencySymbol)}
                  </Text>
                  <Text className="text-[10px] text-accent font-semibold">{salesPct} of sales</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      <TouchableOpacity
        onPress={() => onNavigateToTab("Items")}
        className="mt-5 pt-3 border-t border-base-200 flex-row justify-end items-center"
      >
        <Text className="text-xs font-bold text-primary mr-1">View full product report</Text>
        <MaterialIcons name="arrow-forward" size={14} color="#DC2D2A" />
      </TouchableOpacity>
    </View>
  );
}
