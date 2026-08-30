// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components / context / utils
import { KpiCard } from "@/components/reuseable";
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
}

export default function ExpenseKPICards({
  startDate,
  endDate,
  currencySymbol = "£",
}: Readonly<IExpenseKPICardsProps>) {
  const queryParams: IExpenseMatrixParams = {
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
  };

  const { data: matrixRes, isLoading } = useExpenseMatrixQuery(queryParams);

  const { totalExpenses, topExpenseTypeName, topExpenseSpent, averageAmount } =
    ExpenseService.processMatrixData(matrixRes?.data);

  return (
    <View className="flex-col gap-3 my-2">
      {/* Card 1: Total Expenses (Full Width) */}
      <View className="flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Total Expenses"
          value={formatAmount(totalExpenses, currencySymbol)}
          subtitle="Based on filtered range"
          icon="account-balance-wallet"
          iconColor="#9333EA"
          iconBgColor="#F3E8FF"
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
          loading={isLoading}
          title="Top Expense Type"
          value={topExpenseTypeName}
          subtitle={`${formatAmount(topExpenseSpent, currencySymbol)} total spent`}
          icon="local-offer"
          iconColor="#16A34A"
          iconBgColor="#DCFCE7"
          textColor="#111827"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />

        {/* Avg Expense Amount */}
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Avg Expense Amount"
          value={formatAmount(averageAmount, currencySymbol)}
          subtitle="Per transaction average"
          icon="trending-up"
          iconColor="#EA580C"
          iconBgColor="#FFEDD5"
          textColor="#111827"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>
    </View>
  );
}
