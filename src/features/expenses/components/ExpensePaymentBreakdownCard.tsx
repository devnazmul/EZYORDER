// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { DoughnutChart, EmptyState, ErrorState } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";

// 5. Feature services & skeletons
import { ExpenseService } from "../services/expense.service";
import ExpensePaymentBreakdownSkeleton from "./skeletons/ExpensePaymentBreakdownSkeleton";

// 6. Types
import type { IPaymentMethodBreakdownItem } from "../types";

// 7. Constants/utils
import { formatAmount } from "@/utils/formatters";
import { WP } from "@/utils/getResponsiveSizes";

export interface IExpensePaymentBreakdownCardProps {
  data?: IPaymentMethodBreakdownItem[] | null;
  currencySymbol?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

export default function ExpensePaymentBreakdownCard({
  data,
  currencySymbol = "£",
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<IExpensePaymentBreakdownCardProps>) {
  const { total, chartItems } =
    ExpenseService.getPaymentMethodBreakdownChartData(data, currencySymbol);

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          message="Failed to load payment breakdown data."
          onRetry={onRetry}
          pyClassName="py-4"
        />
      );
    }

    if (total === 0 || chartItems.length === 0) {
      return (
        <EmptyState
          icon="payments"
          description="No expense payment breakdown data for this period."
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
      title="Payment Method Breakdown"
      isLoading={isLoading}
      skeleton={<ExpensePaymentBreakdownSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
    >
      <View className="gap-y-4">{renderContent()}</View>
    </ActionCard>
  );
}
