// 1. React / React Native
import React from "react";
import { Text, View } from "react-native";

// 4. Shared components
import { EmptyState, ErrorState } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";

// 5. Feature components/hooks
import TopProductsListSkeleton from "./skeletons/TopProductsListSkeleton";

// 6. Types
import type { ITopProductItem } from "../types";

// 7. Constants/utils
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export interface ITopProductsListProps {
  itemList?: ITopProductItem[];
  currencySymbol?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

export default function TopProductsList({
  itemList = [],
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<ITopProductsListProps>) {
  const displayList =
    itemList && itemList.length > 0 ? itemList.slice(0, 5) : [];

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          message="Failed to load top products data."
          onRetry={onRetry}
          pyClassName="py-4"
        />
      );
    }

    if (displayList.length === 0) {
      return (
        <EmptyState
          icon="shopping-bag"
          description="No items sold in this period."
          pyClassName="py-4"
        />
      );
    }

    return displayList.map((item, idx) => {
      return (
        <View
          key={item.item_name || idx}
          style={{ padding: WP("3%") }}
          className="flex-row items-center justify-between border border-base-200 rounded-lg bg-base-100/50"
        >
          {/* Left: Rank + Product Name (wraps if long) */}
          <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-3">
            <View className="rounded-lg bg-primary/10 items-center justify-center px-3 py-1 shrink-0">
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className="font-bold text-primary"
              >
                {idx + 1}
              </Text>
            </View>

            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="font-semibold text-neutral flex-1 flex-wrap capitalize"
            >
              {item.item_name}
            </Text>
          </View>

          {/* Right: Quantity Sold */}
          <View className="items-end shrink-0">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="text-accent font-bold"
            >
              Qty Sold: {item.quantity_sold}
            </Text>
          </View>
        </View>
      );
    });
  };

  return (
    <ActionCard
      title="Top Selling Products"
      isLoading={isLoading}
      skeleton={<TopProductsListSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Product Report"
    >
      <View className="gap-y-3">{renderContent()}</View>
    </ActionCard>
  );
}
