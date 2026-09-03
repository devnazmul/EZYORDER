// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import {
  ActionCard,
  BarChart,
  EmptyState,
  ErrorState,
  LineChart,
} from "@/components/reuseable";

// 5. Feature services & skeletons
import { ExpenseService } from "../services/expense.service";
import ExpenseTrendSkeleton from "./skeletons/ExpenseTrendSkeleton";

// 6. Types
import type { IExpenseTrendItem } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { WP } from "@/utils/getResponsiveSizes";

export interface IExpenseTrendCardProps {
  data?: IExpenseTrendItem[] | null;
  currencySymbol?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

export default function ExpenseTrendCard({
  data,
  currencySymbol = "£",
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<IExpenseTrendCardProps>) {
  const { chartData, isEmpty } = ExpenseService.getExpenseTrendChartData(data);

  const isLineChart = chartData.length > 14;

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          message="Failed to load expense trend data."
          onRetry={onRetry}
          pyClassName="py-4"
        />
      );
    }

    if (isEmpty) {
      return (
        <EmptyState
          icon="show-chart"
          description="No expense trend data available for this period."
          pyClassName="py-4"
        />
      );
    }

    if (isLineChart) {
      return (
        <View className="py-2 w-full">
          <LineChart
            data={chartData}
            currencySymbol={currencySymbol}
            chartHeight={145}
            isAmount={true}
          />
        </View>
      );
    }

    return (
      <View className="py-2 w-full">
        <BarChart
          data={chartData}
          currencySymbol={currencySymbol}
          frontColor={COLORS.primary}
          gradientColor="#FF9E93"
          showGradient={true}
          chartHeight={220}
          isAmount={true}
        />
      </View>
    );
  };

  return (
    <ActionCard
      title="Expense Trend"
      isLoading={isLoading}
      skeleton={<ExpenseTrendSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
    >
      <View className="gap-y-4">{renderContent()}</View>
    </ActionCard>
  );
}
