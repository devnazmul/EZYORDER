// 1. React / React Native
import React, { useMemo } from "react";
import { View } from "react-native";

// 4. Shared components
import {
  ActionCard,
  BarChart,
  EmptyState,
  ErrorState,
  type IBarChartDataItem,
} from "@/components/reuseable";

// 5. Feature components/hooks
import OrderSalesMetricsSkeleton from "./skeletons/OrderSalesMetricsSkeleton";

// 6. Types
import { IOrderSummaryData } from "../types";

// 7. Constants/utils
import { WP } from "@/utils";

function renderCardContent(
  isError: boolean,
  hasSalesData: boolean,
  onRetry: (() => void) | undefined,
  barData: IBarChartDataItem[],
  currencySymbol: string,
) {
  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Sales Overview"
        message="Unable to retrieve sales metrics. Please try again."
        onRetry={onRetry}
        pyClassName="py-4"
      />
    );
  }

  if (!hasSalesData) {
    return (
      <EmptyState
        icon="analytics"
        title="No Sales Data"
        description="No sales metrics available for the selected period."
        pyClassName="py-4"
      />
    );
  }

  return (
    <View className="items-center w-full">
      <BarChart
        data={barData}
        currencySymbol={currencySymbol}
        chartHeight={190}
        isAmount={true}
        showGradient={true}
        showValuesAsTopLabel={true}
        noOfSections={4}
      />
    </View>
  );
}

export interface IOrderSalesMetricsCardProps {
  summaryData: IOrderSummaryData | null | undefined;
  currencySymbol: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

export default function OrderSalesMetricsCard({
  summaryData,
  currencySymbol,
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<IOrderSalesMetricsCardProps>) {
  const grossSales = summaryData?.sales?.completed_gross_sales ?? 0;
  const netSales = summaryData?.sales?.completed_net_sales ?? 0;
  const discounts = summaryData?.sales?.completed_discounts ?? 0;

  const barData: IBarChartDataItem[] = useMemo(() => {
    return [
      {
        name: "Gross",
        value: grossSales,
        frontColor: "#6366F1", // Indigo
        gradientColor: "#A5B4FC",
      },
      {
        name: "Net",
        value: netSales,
        frontColor: "#3B82F6", // Blue
        gradientColor: "#93C5FD",
      },
      {
        name: "Discount",
        value: discounts,
        frontColor: "#F97316", // Orange
        gradientColor: "#FDBA74",
      },
    ];
  }, [grossSales, netSales, discounts]);

  const hasSalesData = grossSales > 0 || netSales > 0 || discounts > 0;

  return (
    <ActionCard
      title="Sales Overview"
      isLoading={isLoading}
      skeleton={
        <OrderSalesMetricsSkeleton containerClassName={containerClassName} />
      }
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
    >
      <View className="py-2">
        {renderCardContent(
          isError,
          hasSalesData,
          onRetry,
          barData,
          currencySymbol,
        )}
      </View>
    </ActionCard>
  );
}
