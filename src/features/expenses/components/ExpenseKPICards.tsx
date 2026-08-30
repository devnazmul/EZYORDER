// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components / context / utils
import { KpiCard } from "@/components/reuseable";
import { COLORS } from "@/constants/colors";
import { formatAmount } from "@/utils";

// 5. Feature hooks, services & apis
import { useExpenseMatrixQuery } from "../hooks/queries/useExpenseQueries";
import { ExpenseService } from "../services/expense.service";

// 6. Types
import type { IExpenseMatrixParams } from "../types";

export interface IExpenseKPICardsProps {
  startDate?: string;
  endDate?: string;
  currencySymbol?: string;
  isLoading?: boolean;
}

export default function ExpenseKPICards({
  startDate,
  endDate,
  currencySymbol = "£",
  isLoading = false,
}: Readonly<IExpenseKPICardsProps>) {
  const queryParams: IExpenseMatrixParams = {
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
  };

  const { data: matrixRes, isLoading: isMatrixLoading } =
    useExpenseMatrixQuery(queryParams);

  const showLoading = isLoading || isMatrixLoading;

  const { totalExpenses, topExpenseTypeName, topExpenseSpent, averageAmount } =
    ExpenseService.processMatrixData(matrixRes?.data);

  return (
    <View className="flex-col gap-3">
      {/* Card 1: Total Expenses (Full Width) */}
      <View className="flex-1">
        <KpiCard
          variant="light"
          loading={showLoading}
          title="Total Expenses"
          value={formatAmount(totalExpenses, currencySymbol)}
          subtitle="Based on filtered range"
          icon="account-balance-wallet"
          iconColor={COLORS.amount.total}
          iconBgColor={`${COLORS.amount.total}20`}
          textColor="#111827"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Cards 2 & 3 (Side by Side Grid) */}
      <View className="flex-row gap-3 flex-1">
        {/* Top Expense Type */}
        <KpiCard
          variant="light"
          loading={showLoading}
          title="Top Expense Type"
          value={topExpenseTypeName}
          subtitle={`${formatAmount(topExpenseSpent, currencySymbol)} total spent`}
          icon="local-offer"
          iconColor={COLORS.amount.gross}
          iconBgColor={`${COLORS.amount.gross}20`}
          textColor="#111827"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />

        {/* Avg Expense Amount */}
        <KpiCard
          variant="light"
          loading={showLoading}
          title="Avg Expense Amount"
          value={formatAmount(averageAmount, currencySymbol)}
          subtitle="Per transaction average"
          icon="trending-up"
          iconColor={COLORS.amount.average}
          iconBgColor={`${COLORS.amount.average}20`}
          textColor="#111827"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>
    </View>
  );
}
