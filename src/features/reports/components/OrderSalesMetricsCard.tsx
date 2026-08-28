// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import {
  ActionCard,
  BarChart,
  EmptyState,
  ErrorState,
  type IBarChartDataItem,
} from "@/components/reuseable";

// 5. Feature components/services
import { OrderReportsService } from "../services/orderReportsService";
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
  const { barData, hasSalesData } =
    OrderReportsService.getSalesMetricsChartData(summaryData);

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
