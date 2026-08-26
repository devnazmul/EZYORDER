// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { KpiCard } from "@/components/reuseable";

// 6. Types
import { IOrderSummaryData } from "../types";

// 7. Constants/utils
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
  const grossSales = summaryData?.sales?.completed_gross_sales ?? 0;
  const netSales = summaryData?.sales?.completed_net_sales ?? 0;
  const totalOrders = summaryData?.total_orders ?? 0;
  const completedOrders = summaryData?.completed_orders ?? 0;
  const pendingOrders =
    summaryData?.pending?.total ?? summaryData?.pending?.pending ?? 0;
  const cancelledOrders = summaryData?.cancelled?.total ?? 0;
  const avgOrderValue = summaryData?.sales?.average_order_value ?? 0;

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
          iconBgColor="#10B981"
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
          iconColor="#059669"
          iconBgColor="#ECFDF5"
          textColor="#059669"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Completed"
          value={Number(completedOrders).toLocaleString()}
          icon="check-circle"
          iconColor="#3B82F6"
          iconBgColor="#EFF6FF"
          textColor="#3B82F6"
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
          iconColor="#F59E0B"
          iconBgColor="#FFFBEB"
          textColor="#F59E0B"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Cancelled Orders"
          value={Number(cancelledOrders).toLocaleString()}
          icon="cancel"
          iconColor="#EF4444"
          iconBgColor="#FEF2F2"
          textColor="#EF4444"
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
          iconColor="#0D9488"
          iconBgColor="#CCFBF1"
          textColor="#0D9488"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Avg Order Value"
          value={formatAmount(avgOrderValue, currencySymbol)}
          icon="analytics"
          iconColor="#8B5CF6"
          iconBgColor="#F5F3FF"
          textColor="#8B5CF6"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>
    </View>
  );
}
