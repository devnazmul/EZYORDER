import KpiCard from "@/components/reuseable/dashboard/KpiCard";
import FilterDrawer, { FilterField } from "@/components/reuseable/FilterDrawer";
import PageTitle from "@/components/reuseable/PageTitle";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/context/DataContext";
import {
  useSalesByItemQuery,
  useSalesByOrderTypeQuery,
  useSalesDailySummaryQuery,
  useSalesHourlyQuery,
  useSalesSummaryQuery,
  useSalesTrendQuery,
} from "@/hooks/useReportsQueries";
import { formatDate } from "@/utils/formatDate";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { useResponsiveScreen, WP } from "@/utils/getResponsiveSizes";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SparklineChart from "../../components/SparklineChart";
import RevenueByOrderTypeCard from "../components/RevenueByOrderTypeCard";
import SalesAreaChart from "../components/SalesAreaChart";
import SalesByPaymentCard from "../components/SalesByPaymentCard";
import SalesDailyList from "../components/SalesDailyList";
import SalesHourlyList from "../components/SalesHourlyList";
import SalesItemList from "../components/SalesItemList";
import SalesSummaryListCard from "../components/SalesSummaryListCard";
import TopProductsList from "../components/TopProductsList";

// Helper: Calculate Date Period Ranges aligned with calendar boundaries
const getDateRange = (period: string) => {
  const end = new Date();
  const start = new Date();

  if (period === "Today") {
    // Current day range
  } else if (period === "Yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (period === "This Week") {
    start.setDate(start.getDate() - start.getDay());
    end.setDate(end.getDate() + (6 - end.getDay()));
  } else if (period === "This Month") {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
  }

  return {
    start_date: formatDate(start),
    end_date: formatDate(end),
  };
};

const SalesReport = () => {
  const { user, token } = useAuth();
  const { settings } = useData();
  const currencySymbol = getCurrencySymbol(settings?.currency);
  const { isLandscape } = useResponsiveScreen();

  const [activeTab, setActiveTab] = useState("Overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filterValues, setFilterValues] = useState({
    period: "This Week",
    dateRange: { start: "", end: "" },
  });

  const filterFields: FilterField[] = [
    {
      id: "period",
      label: "Filter by Date",
      type: "chips",
      options: [
        { id: "Today", label: "Today" },
        { id: "Yesterday", label: "Yesterday" },
        { id: "This Week", label: "This Week" },
        { id: "This Month", label: "This Month" },
      ],
    },
    {
      id: "dateRange",
      label: "Custom Date Range",
      type: "date-range",
    },
  ];

  const apiParams = useMemo(() => {
    const restaurantId = user?.restaurant?.[0]?.id || "";
    let startDate = "";
    let endDate = "";

    const { period, dateRange } = filterValues;
    if (dateRange.start && dateRange.end) {
      startDate = dateRange.start;
      endDate = dateRange.end;
    } else {
      const range = getDateRange(period);
      startDate = range.start_date;
      endDate = range.end_date;
    }

    return {
      restaurant_id: restaurantId,
      start_date: startDate,
      end_date: endDate,
      group_by: (period === "This Month" ? "week" : "day") as "day" | "week",
    };
  }, [user, filterValues]);

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

  const {
    data: itemData,
    isLoading: isItemLoading,
    refetch: refetchItem,
  } = useSalesByItemQuery(token, apiParams);

  const {
    data: hourlyData,
    isLoading: isHourlyLoading,
    refetch: refetchHourly,
  } = useSalesHourlyQuery(token, apiParams);

  const {
    data: dailySummaryData,
    isLoading: isDailyLoading,
    refetch: refetchDaily,
  } = useSalesDailySummaryQuery(token, apiParams);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchSummary(),
      refetchTrend(),
      refetchOrderType(),
      refetchItem(),
      refetchHourly(),
      refetchDaily(),
    ]);
    setIsRefreshing(false);
  };

  const handleApplyFilters = (newValues: any) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues({
      period: "This Week",
      dateRange: { start: "", end: "" },
    });
  };

  const grossSales = summaryData?.gross_sales ?? 0;
  const netSales = summaryData?.net_sales ?? 0;
  const totalOrders = summaryData?.total_orders ?? 0;
  const discounts = summaryData?.discounts ?? 0;
  const avgOrderValue = totalOrders > 0 ? grossSales / totalOrders : 0;

  const itemList = itemData || [];
  const hourlyList = hourlyData || [];
  const dailyList = dailySummaryData || [];

  const sparklineData = useMemo(() => {
    if (!trendData || !Array.isArray(trendData)) return [];
    return trendData.map((d: any) => Number(d.sales || 0));
  }, [trendData]);

  const isAnyLoading =
    isSummaryLoading ||
    isTrendLoading ||
    isOrderTypeLoading ||
    isItemLoading ||
    isHourlyLoading ||
    isDailyLoading;

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-base-100 pt-4"
      style={{ paddingHorizontal: WP("4%") }}
    >
      <RefreshableScrollView onRefresh={handleRefresh} refreshing={isRefreshing}>
        {/* Header Title and Filter Trigger */}

        <PageTitle
          title="Sales Report"
          icon="bar-chart"
          description="Analyze your sales performance and trends"
        />

        {/* Tab Selection */}
        <ToggleBar
          options={[
            { id: "Overview", label: "Overview" },
            { id: "Daily", label: "Daily" },
            { id: "Items", label: "Items" },
            { id: "Hourly", label: "Hourly" },
          ]}
          activeId={activeTab}
          onSelect={setActiveTab}
          containerClassName=" mb-3"
        />

        <View className="flex items-end justify-center mb-3">
          <FilterDrawer
            fields={filterFields}
            values={filterValues}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </View>

        {isAnyLoading && !isRefreshing && (
          <View key="loading" className="py-10 justify-center items-center">
            <ActivityIndicator size="large" color="#DC2D2A" />
          </View>
        )}

        {!isAnyLoading && activeTab === "Overview" && (
          <View key="overview" className="gap-y-3 pb-6">
            <View className="flex-col gap-y-3">
              <View className="flex-1">
                <KpiCard
                  variant="dark"
                  minHeight={120}
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
              <View className="flex-row gap-3 flex-1">
                <KpiCard
                  variant="light"
                  title="Total Orders"
                  value={totalOrders.toLocaleString()}
                  icon="shopping-bag"
                  iconColor="#F43F5E"
                  iconBgColor="#FFE4E6"
                  gradientColors={["#FFE4E6", "#FECDD3"]}
                  containerClassName="flex-1"
                />
                <KpiCard
                  variant="light"
                  title="Avg Order Value"
                  value={formatAmount(avgOrderValue, currencySymbol)}
                  icon="payments"
                  iconColor="#D97706"
                  iconBgColor="#FEF3C7"
                  gradientColors={["#FEF3C7", "#FDE68A"]}
                  containerClassName="flex-1"
                />
              </View>
              <View className="flex-row gap-3 flex-1">
                <KpiCard
                  variant="light"
                  title="Total Discounts"
                  value={formatAmount(discounts, currencySymbol)}
                  icon="local-offer"
                  iconColor="#8B5CF6"
                  iconBgColor="#EDE9FE"
                  gradientColors={["#EDE9FE", "#DDD6FE"]}
                  containerClassName="flex-1"
                />
                <KpiCard
                  variant="light"
                  title="Net Sales"
                  value={formatAmount(netSales, currencySymbol)}
                  icon="account-balance-wallet"
                  iconColor="#059669"
                  iconBgColor="#D1FAE5"
                  gradientColors={["#D1FAE5", "#A7F3D0"]}
                  containerClassName="flex-1"
                />
              </View>
            </View>

            <SalesSummaryListCard
              salesSummary={summaryData}
              currencySymbol={currencySymbol}
              onNavigateToTab={setActiveTab}
            />

            {/* Daily/Weekly Revenue Trend Chart */}
            <SalesAreaChart
              trendData={trendData}
              currencySymbol={currencySymbol}
              isLoading={isTrendLoading}
            />

            {/* Payment splits */}
            <SalesByPaymentCard
              salesSummary={summaryData}
              currencySymbol={currencySymbol}
              onNavigateToTab={setActiveTab}
            />

            {/* Order types splits */}
            <RevenueByOrderTypeCard
              orderTypeData={orderTypeData}
              netSales={netSales}
              currencySymbol={currencySymbol}
            />

            {/* Top performing items */}
            <TopProductsList
              itemList={itemList}
              currencySymbol={currencySymbol}
              onNavigateToTab={setActiveTab}
            />
          </View>
        )}

        {!isAnyLoading && activeTab === "Daily" && (
          <View key="daily">
            <SalesDailyList dailyList={dailyList} currencySymbol={currencySymbol} />
          </View>
        )}

        {!isAnyLoading && activeTab === "Items" && (
          <View key="items">
            <SalesItemList itemList={itemList} currencySymbol={currencySymbol} />
          </View>
        )}

        {!isAnyLoading && activeTab === "Hourly" && (
          <View key="hourly">
            <SalesHourlyList hourlyList={hourlyList} currencySymbol={currencySymbol} />
          </View>
        )}
      </RefreshableScrollView>
    </SafeAreaView>
  );
};

export default SalesReport;
