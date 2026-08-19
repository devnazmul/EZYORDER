import { KpiCard } from "@/components/reuseable";
import { formatAmount, useResponsiveScreen, WP } from "@/utils";
import React from "react";
import { View } from "react-native";
import { SparklineChart } from "../../components";

export interface IKPICardGridProps {
  grossSales: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
  discounts: number;
  netSales: number;
  totalTax: number;
  totalExpenses: number;
  sparklineData: number[];
  currencySymbol: string;
  isLoading: boolean;
}

export default function KPICardGrid({
  grossSales,
  totalOrders,
  completedOrders,
  pendingOrders,
  cancelledOrders,
  avgOrderValue,
  discounts,
  netSales,
  totalTax,
  totalExpenses,
  sparklineData,
  currencySymbol,
  isLoading,
}: Readonly<IKPICardGridProps>) {
  const { isLandscape } = useResponsiveScreen();

  return (
    <View className="flex-col gap-y-3">
      {/* Row 1 (Full width): Total Sales */}
      <View className="flex-1">
        <KpiCard
          variant="dark"
          minHeight={120}
          loading={isLoading}
          title="Total Sales"
          value={formatAmount(grossSales, currencySymbol)}
          gradientColors={["#111827", "#0F172A"]}
          icon="currency-pound"
          iconColor="#FFFFFF"
          iconBgColor="#10B981"
          rightElement={
            <SparklineChart
              data={sparklineData}
              width={isLandscape ? WP("22%") : WP("38%")}
              height={70}
              paddingBottom={14}
              strokeColor="#10B981"
              gradientId="salesReportSparkline"
            />
          }
        />
      </View>

      {/* Row 2 (2 columns): Total Orders & Completed Orders */}
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
          title="Completed Orders"
          value={Number(completedOrders).toLocaleString()}
          icon="check-circle"
          iconColor="#3B82F6"
          iconBgColor="#EFF6FF"
          textColor="#3B82F6"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Row 3 (Full width): Pending Orders */}
      <View className="flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Pending Orders"
          value={Number(pendingOrders).toLocaleString()}
          icon="schedule"
          iconColor="#F59E0B"
          iconBgColor="#FFFBEB"
          textColor="#F59E0B"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Row 4 (2 columns): Cancelled Orders & Avg Order Value */}
      <View className="flex-row gap-3 flex-1">
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
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Avg Order Value"
          value={formatAmount(avgOrderValue, currencySymbol)}
          icon="payments"
          iconColor="#059669"
          iconBgColor="#ECFDF5"
          textColor="#059669"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Row 5 (Full width): Gross Sales */}
      <View className="flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Gross Sales"
          value={formatAmount(grossSales, currencySymbol)}
          icon="trending-up"
          iconColor="#3B82F6"
          iconBgColor="#EFF6FF"
          textColor="#3B82F6"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Row 6 (2 columns): Discounts & Net Sales */}
      <View className="flex-row gap-3 flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Discounts"
          value={formatAmount(discounts, currencySymbol)}
          icon="local-offer"
          iconColor="#F59E0B"
          iconBgColor="#FFFBEB"
          textColor="#F59E0B"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Net Sales"
          value={formatAmount(netSales, currencySymbol)}
          icon="account-balance-wallet"
          iconColor="#059669"
          iconBgColor="#ECFDF5"
          textColor="#059669"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>

      {/* Row 7 (2 columns): Tax & Expenses */}
      <View className="flex-row gap-3 flex-1">
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Tax"
          value={formatAmount(totalTax, currencySymbol)}
          icon="receipt"
          iconColor="#EF4444"
          iconBgColor="#FEF2F2"
          textColor="#EF4444"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
        <KpiCard
          variant="light"
          loading={isLoading}
          title="Expenses"
          value={formatAmount(totalExpenses, currencySymbol)}
          icon="trending-down"
          iconColor="#EF4444"
          iconBgColor="#FEF2F2"
          textColor="#EF4444"
          gradientColors={["#FFFFFF", "#FFFFFF"]}
          containerClassName="flex-1"
        />
      </View>
    </View>
  );
}
