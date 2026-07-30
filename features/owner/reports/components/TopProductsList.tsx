import ActionCard from "@/components/reuseable/cards/ActionCard";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

import React from "react";
import { Text, View } from "react-native";
import TopProductsListSkeleton from "./skeletons/TopProductsListSkeleton";

interface TopProductsListProps {
  itemList: any[];
  currencySymbol: string;
  isLoading?: boolean;
  onNavigateToTab: (tab: string) => void;
  containerClassName?: string;
}

export default function TopProductsList({
  itemList,
  currencySymbol,
  isLoading = false,
  onNavigateToTab,
  containerClassName = "",
}: TopProductsListProps) {
  const totalItemSales = itemList?.reduce((acc, item) => acc + Number(item.net_sales || 0), 0) || 0;
  const displayList = itemList && itemList.length > 0 ? itemList.slice(0, 5) : [];

  return (
    <ActionCard
      title="Top Selling Products"
      isLoading={isLoading}
      skeleton={<TopProductsListSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Product Report"
      onActionPress={() => onNavigateToTab("Items")}
    >
      <View className="gap-y-3">
        {displayList.length === 0 ? (
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-accent italic text-center py-4"
          >
            No items sold in this period.
          </Text>
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
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between border border-base-200 rounded-lg bg-base-100/50"
              >
                <View className="flex-row items-center gap-3 flex-1 min-w-0">
                  <View className="rounded-lg bg-primary/10 items-center justify-center px-3 py-1">
                    <Text
                      style={{ fontSize: getResponsiveFontSize("sm") }}
                      className="font-bold text-primary"
                    >
                      {idx + 1}
                    </Text>
                  </View>

                  <View className="flex-1 min-w-0">
                    <Text
                      style={{ fontSize: getResponsiveFontSize("sm") }}
                      className="font-semibold text-neutral truncate"
                      numberOfLines={1}
                    >
                      {item.item_name}
                    </Text>
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="text-accent font-semibold"
                    >
                      Qty Sold: {Number(item.quantity_sold)}
                    </Text>
                  </View>
                </View>

                <View className="items-end ml-2">
                  <Text
                    style={{ fontSize: getResponsiveFontSize("sm") }}
                    className="font-semibold text-neutral"
                  >
                    {formatAmount(item.net_sales, currencySymbol)}
                  </Text>
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="text-accent font-semibold"
                  >
                    {salesPct} of sales
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ActionCard>
  );
}
