import AppHeader from "@/components/AppHeader";
import KpiCard from "@/components/reports/KpiCard";
import RevenueByOrderTypeCard from "@/components/reports/RevenueByOrderTypeCard";
import SalesBarChart from "@/components/reports/SalesBarChart";
import FilterChips from "@/components/reuseable/FilterChips";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import {
  useSalesByOrderTypeQuery,
  useSalesSummaryQuery,
  useSalesTrendQuery,
} from "@/hooks/useReportsQueries";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper: Format Date as YYYY-MM-DD
const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Helper: Calculate Date Period Ranges
const getDateRange = (period: string) => {
  const end = new Date();
  const start = new Date();

  if (period === "Today") {
    // start is today
  } else if (period === "Yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (period === "This Week") {
    start.setDate(start.getDate() - 7);
  } else if (period === "This Month") {
    start.setDate(start.getDate() - 30);
  }

  return {
    start_date: formatDate(start),
    end_date: formatDate(end),
  };
};

export default function SalesReport() {
  const { user, token } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("This Week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate parameters for API
  const apiParams = useMemo(() => {
    const restaurantId = user?.restaurant?.[0]?.id || "";
    const range = getDateRange(selectedPeriod);
    return {
      restaurant_id: restaurantId,
      start_date: range.start_date,
      end_date: range.end_date,
      group_by: (selectedPeriod === "This Month" ? "week" : "day") as "day" | "week",
    };
  }, [user, selectedPeriod]);

  // Fetch report data
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useSalesSummaryQuery(token, apiParams);
  const {
    data: trendData,
    isLoading: isTrendLoading,
    refetch: refetchTrend,
  } = useSalesTrendQuery(token, apiParams);
  const {
    data: orderTypeData,
    isLoading: isOrderTypeLoading,
    refetch: refetchOrderType,
  } = useSalesByOrderTypeQuery(token, apiParams);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchSummary(), refetchTrend(), refetchOrderType()]);
    setIsRefreshing(false);
  };

  // Fallback KPIs calculations if data is null/0
  const grossSales = summaryData?.gross_sales ?? 0;
  const netSales = summaryData?.net_sales ?? 0;
  const totalOrders = summaryData?.total_orders ?? 0;
  const discounts = summaryData?.discounts ?? 0;
  const refunds = summaryData?.refunds ?? 0;
  const avgOrderValue = totalOrders > 0 ? grossSales / totalOrders : 0;


  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton />

      <RefreshableScrollView onRefresh={handleRefresh} refreshing={isRefreshing}>
        {/* Horizontal Date Filters row */}
        <FilterChips
          chips={[
            { id: "Today", label: "Today" },
            { id: "Yesterday", label: "Yesterday" },
            { id: "This Week", label: "This Week" },
            { id: "This Month", label: "This Month" },
          ]}
          selectedId={selectedPeriod}
          onSelect={setSelectedPeriod}
          containerClassName="mb-6"
        />

        {/* 1. Main High Contrast KPI Revenue Card */}
        <KpiCard
          variant="dark"
          title="Total Revenue"
          value={`$${grossSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trendText="+8.5% vs last period"
          trendType="up"
          containerClassName="mb-6"
        />

        {/* 2. Dynamic Daily Revenue Chart */}
        <SalesBarChart
          trendData={trendData}
          currencySymbol="$"
          isLoading={isTrendLoading}
          containerClassName="mb-6"
        />

        {/* 3. Revenue by Order Type list */}
        <RevenueByOrderTypeCard orderTypeData={orderTypeData} netSales={netSales} />

        {/* 4. KPI stats row list grid */}
        <View className="gap-3">
          <KpiCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            iconName="receipt-long"
            containerClassName="flex-1"
          />
          <KpiCard
            title="Avg Order Value"
            value={`$${avgOrderValue.toFixed(2)}`}
            iconName="payments"
            containerClassName="flex-1"
          />
          <KpiCard
            title="Total Discounts"
            value={`$${discounts.toFixed(2)}`}
            iconName="local-offer"
            containerClassName="flex-1"
          />
          <KpiCard
            title="Net Sales"
            value={`$${netSales.toFixed(2)}`}
            iconName="account-balance-wallet"
            containerClassName="flex-1"
          />
          <KpiCard
            title="Refunds"
            value={`$${refunds.toFixed(2)}`}
            iconName="undo"
            containerClassName="flex-1"
          />
        </View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
