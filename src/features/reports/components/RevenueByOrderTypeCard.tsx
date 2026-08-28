// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { DoughnutChart, EmptyState, ErrorState } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";

// 5. Feature components/services
import { SalesReportsService } from "../services/salesReportsService";
import RevenueByOrderTypeSkeleton from "./skeletons/RevenueByOrderTypeSkeleton";

// 6. Types
import type { ISalesByOrderTypeItem } from "../types";

// 7. Constants/utils
import { formatAmount } from "@/utils/formatters";
import { WP } from "@/utils/getResponsiveSizes";

export interface IRevenueByOrderTypeCardProps {
  orderTypeData?: ISalesByOrderTypeItem[] | Record<string, unknown> | null;
  netSales: number;
  currencySymbol: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

export default function RevenueByOrderTypeCard({
  orderTypeData,
  netSales = 0,
  currencySymbol,
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<IRevenueByOrderTypeCardProps>) {
  const { totalAmount, chartItems, isEmpty } =
    SalesReportsService.getRevenueByOrderTypeChartData(orderTypeData, netSales);

  const totalDisplay = formatAmount(totalAmount || netSales, currencySymbol);

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

    if (isEmpty) {
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
