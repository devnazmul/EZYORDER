// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { DoughnutChart, EmptyState, ErrorState } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";

// 5. Feature components/services
import { ReportsService } from "../services/reportsService";
import SalesByPaymentSkeleton from "./skeletons/SalesByPaymentSkeleton";

// 6. Types
import type { IPaymentSummaryData } from "../types";

// 7. Constants/utils
import { formatAmount } from "@/utils/formatters";
import { WP } from "@/utils/getResponsiveSizes";

export interface ISalesByPaymentCardProps {
  paymentSummary?: IPaymentSummaryData | null;
  currencySymbol: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

export default function SalesByPaymentCard({
  paymentSummary,
  currencySymbol,
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<ISalesByPaymentCardProps>) {
  const { total, chartItems } =
    ReportsService.getPaymentChartData(paymentSummary);

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          message="Failed to load payment summary data."
          onRetry={onRetry}
          pyClassName="py-4"
        />
      );
    }

    if (total === 0) {
      return (
        <EmptyState
          icon="payments"
          description="No payment data for this period."
          pyClassName="py-4"
        />
      );
    }

    return (
      <View className="items-center justify-center py-2">
        <DoughnutChart
          items={chartItems}
          totalValue={formatAmount(total, currencySymbol)}
          label="Total"
          showLegend={true}
          legendPosition="right"
          size={WP("34%")}
          thickness={WP("5%")}
        />
      </View>
    );
  };

  return (
    <ActionCard
      title="Sales by Payment Methods"
      isLoading={isLoading}
      skeleton={<SalesByPaymentSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Report"
    >
      <View className="gap-y-4">{renderContent()}</View>
    </ActionCard>
  );
}
