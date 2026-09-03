// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { KpiCard } from "@/components/reuseable";

// 5. Feature components/services
import { OrderReportsService } from "../services/orderReportsService";

// 6. Types
import { IOrderSummaryData } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { formatAmount } from "@/utils";

export interface IOrderReportKPIGridProps {
  summaryData: IOrderSummaryData | null | undefined;
  currencySymbol: string;
  isLoading: boolean;
}

export default function OrderReportKPIGrid({
  summaryData,
  currencySymbol,
  isLoading,
}: Readonly<IOrderReportKPIGridProps>) {
  const {
    grossSales,
    netSales,
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    avgOrderValue,
  } = OrderReportsService.getKPIMetrics(summaryData);

  return (
    <View className="flex-col gap-y-3">
      {/* Row 1: Total Sales (Dark/Hero Card) */}
      <View className="flex-1">
        <KpiCard
          variant="dark"
          minHeight={110}
          loading={isLoading}
          title="Total Sales"
          value={formatAmount(grossSales, currencySymbol)}
          gradientColors={["#111827", "#0F172A"]}
          icon="currency-pound"
          iconColor="#FFFFFF"
          iconBgColor={COLORS.amount.total}
          subtitle="Gross sales for selected period"
        />
      </View>

      {/* Row 2: Total Orders & Completed Orders */}
      <View className="flex-row gap-3 flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Total Orders"
          value={Number(totalOrders).toLocaleString()}
          icon="shopping-bag"
          iconColor={COLORS.amount.total}
          iconBgColor={`${COLORS.amount.total}15`}
          textColor={COLORS.amount.total}
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Completed"
          value={Number(completedOrders).toLocaleString()}
          icon="check-circle"
          iconColor={COLORS.orderStatus.completed}
          iconBgColor={`${COLORS.orderStatus.completed}15`}
          textColor={COLORS.orderStatus.completed}
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Row 3: Pending Orders & Cancelled Orders */}
      <View className="flex-row gap-3 flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Pending Orders"
          value={Number(pendingOrders).toLocaleString()}
          icon="pending-actions"
          iconColor={COLORS.orderStatus.pending}
          iconBgColor={`${COLORS.orderStatus.pending}15`}
          textColor={COLORS.orderStatus.pending}
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Cancelled Orders"
          value={Number(cancelledOrders).toLocaleString()}
          icon="cancel"
          iconColor={COLORS.orderStatus.cancelled}
          iconBgColor={`${COLORS.orderStatus.cancelled}15`}
          textColor={COLORS.orderStatus.cancelled}
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Row 4: Net Sales & Average Order Value */}
      <View className="flex-row gap-3 flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Net Sales"
          value={formatAmount(netSales, currencySymbol)}
          icon="account-balance-wallet"
          iconColor={COLORS.amount.net}
          iconBgColor={`${COLORS.amount.net}15`}
          textColor={COLORS.amount.net}
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Avg Order Value"
          value={formatAmount(avgOrderValue, currencySymbol)}
          icon="analytics"
          iconColor={COLORS.amount.average}
          iconBgColor={`${COLORS.amount.average}15`}
          textColor={COLORS.amount.average}
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>
    </View>
  );
}
