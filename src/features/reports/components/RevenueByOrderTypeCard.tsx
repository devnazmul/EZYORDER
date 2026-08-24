// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { EmptyState, ErrorState } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";
import DoughnutChart, {
  IDoughnutChartItem,
} from "@/components/reuseable/DoughnutChart";

// 5. Feature components/hooks
import RevenueByOrderTypeSkeleton from "./skeletons/RevenueByOrderTypeSkeleton";

// 6. Types
import type { ISalesByOrderTypeItem } from "../types";

// 7. Constants/utils
import { formatAmount } from "@/utils/formatters";
import { WP } from "@/utils/getResponsiveSizes";
import { getOrderTypeColor } from "@/utils/orderTypeColors";

export interface IRevenueByOrderTypeCardProps {
  orderTypeData?: ISalesByOrderTypeItem[] | Record<string, unknown> | null;
  netSales: number;
  currencySymbol: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

const formatLabel = (type: string) => {
  return type.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function RevenueByOrderTypeCard({
  orderTypeData,
  netSales = 0,
  currencySymbol,
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<IRevenueByOrderTypeCardProps>) {
  const list: ISalesByOrderTypeItem[] = Array.isArray(orderTypeData)
    ? orderTypeData
    : [];

  const totalAmount = list.reduce(
    (acc: number, item: ISalesByOrderTypeItem) =>
      acc + Number(item.total_sales || item.amount || item.value || 0),
    0,
  );
  const totalDisplay = formatAmount(totalAmount || netSales, currencySymbol);

  const chartItems: IDoughnutChartItem[] = list.map(
    (item: ISalesByOrderTypeItem) => {
      const val = Number(item.total_sales || item.amount || item.value || 0);
      const label = formatLabel(item.order_type || "");
      const typeColor = getOrderTypeColor(item.order_type || "");
      const percent =
        netSales > 0 ? Math.min(Math.round((val / netSales) * 100), 100) : 0;

      return {
        label,
        value: val,
        color: typeColor,
        legendValue: `${percent}%`,
      };
    },
  );

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          message="Failed to load revenue by order type data."
          onRetry={onRetry}
          pyClassName="py-4"
        />
      );
    }

    if (list.length === 0) {
      return (
        <EmptyState
          icon="pie-chart"
          description="No order data for this period."
          pyClassName="py-4"
        />
      );
    }

    return (
      <View className="items-center justify-center py-2">
        <DoughnutChart
          items={chartItems}
          totalValue={totalDisplay}
          label="Total"
          showLegend={true}
          legendPosition="right"
          size={WP("38%")}
          thickness={WP("5%")}
        />
      </View>
    );
  };

  return (
    <ActionCard
      title="Revenue by Order Type"
      isLoading={isLoading}
      skeleton={<RevenueByOrderTypeSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
    >
      <View className="gap-y-4">{renderContent()}</View>
    </ActionCard>
  );
}
