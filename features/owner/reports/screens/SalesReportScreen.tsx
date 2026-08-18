import {
  ActionCard,
  FilterDrawer,
  FilterField,
  KpiCard,
  PageTitle,
  RefreshableScrollView,
  ToggleBar,
} from "@/components/reuseable";
import { useAuth, useData } from "@/hooks";
import {
  formatAmount,
  formatDate,
  getCurrencySymbol,
  useResponsiveScreen,
  WP,
} from "@/utils";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SparklineChart } from "../../components";
import {
  RevenueByOrderTypeCard,
  SalesAreaChart,
  SalesByPaymentCard,
  SalesDailyList,
  SalesDailyListSkeleton,
  SalesHourlyList,
  SalesHourlyListSkeleton,
  SalesItemList,
  SalesItemListSkeleton,
  SalesSummaryListCard,
  TopProductsList,
} from "../components";
import {
  useSalesByItemQuery,
  useSalesByOrderTypeQuery,
  useSalesDailySummaryQuery,
  useSalesHourlyQuery,
  useSalesSummaryQuery,
  useSalesTrendQuery,
} from "../hooks/queries";

// Helper: Calculate Date Period Ranges aligned with calendar boundaries
const getDateRange = (period: string) => {
  const end = new Date();
  const start = new Date();

  if (period === "Yesterday") {
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

const INITIAL_FILTER_VALUES = {
  period: "This Week",
  dateRange: { start: "", end: "" },
};

const EMPTY_ARRAY: any[] = [];

const SalesReport = () => {
  const { user } = useAuth();
  const { settings } = useData();
  const currencySymbol = getCurrencySymbol(settings?.currency);
  const { isLandscape } = useResponsiveScreen();

  const [activeTab, setActiveTab] = useState("Overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterValues, setFilterValues] = useState(INITIAL_FILTER_VALUES);

  const { period, dateRange } = filterValues;
  const isCustomRange = Boolean(dateRange.start && dateRange.end);
  const defaultRange = isCustomRange ? null : getDateRange(period);

  const apiParams = {
    restaurant_id: user?.restaurant?.[0]?.id || "",
    start_date: isCustomRange ? dateRange.start : defaultRange!.start_date,
    end_date: isCustomRange ? dateRange.end : defaultRange!.end_date,
    group_by: (period === "This Month" ? "week" : "day") as "day" | "week",
  };

  // Fetch report data
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useSalesSummaryQuery(apiParams);

  const {
    data: trendData,
    isLoading: isTrendLoading,
    refetch: refetchTrend,
  } = useSalesTrendQuery(apiParams);

  const {
    data: orderTypeData,
    isLoading: isOrderTypeLoading,
    refetch: refetchOrderType,
  } = useSalesByOrderTypeQuery(apiParams);

  const {
    data: itemData,
    isLoading: isItemLoading,
    refetch: refetchItem,
  } = useSalesByItemQuery(apiParams);

  const {
    data: hourlyData,
    isLoading: isHourlyLoading,
    refetch: refetchHourly,
  } = useSalesHourlyQuery(apiParams);

  const {
    data: dailySummaryData,
    isLoading: isDailyLoading,
    refetch: refetchDaily,
  } = useSalesDailySummaryQuery(apiParams);

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

  const grossSales = summaryData?.gross_sales ?? 0;
  const netSales = summaryData?.net_sales ?? 0;
  const totalOrders = summaryData?.total_orders ?? 0;
  const discounts = summaryData?.discounts ?? 0;
  const avgOrderValue = totalOrders > 0 ? grossSales / totalOrders : 0;

  const sparklineData = Array.isArray(trendData)
    ? trendData.map((d: any) => Number(d.sales || 0))
    : [];

  return (
    <SafeAreaView
      edges={["left", "right"]}
      className="flex-1 bg-base-100 pt-4"
      style={{ paddingHorizontal: WP("4%") }}
    >
      <RefreshableScrollView
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      >
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
          containerClassName="mb-3"
        />

        <View className="flex items-end justify-center mb-3">
          <FilterDrawer
            fields={filterFields}
            values={filterValues}
            onApply={(values) =>
              setFilterValues(values as typeof INITIAL_FILTER_VALUES)
            }
            onClear={() => setFilterValues(INITIAL_FILTER_VALUES)}
          />
        </View>

        {activeTab === "Overview" && (
          <View key="overview" className="gap-y-3 pb-6">
            <ActionCard title="Insights" bodyStyle={{ padding: WP("3.5%") }}>
              <View className="flex-col gap-y-3">
                <View className="flex-1">
                  <KpiCard
                    variant="dark"
                    minHeight={120}
                    loading={isSummaryLoading && !isRefreshing}
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
                    loading={isSummaryLoading && !isRefreshing}
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
                    loading={isSummaryLoading && !isRefreshing}
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
                    loading={isSummaryLoading && !isRefreshing}
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
                    loading={isSummaryLoading && !isRefreshing}
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
            </ActionCard>

            <SalesSummaryListCard
              salesSummary={summaryData}
              currencySymbol={currencySymbol}
              isLoading={isSummaryLoading && !isRefreshing}
              onNavigateToTab={setActiveTab}
            />

            {/* Daily/Weekly Revenue Trend Chart */}
            <SalesAreaChart
              trendData={trendData}
              currencySymbol={currencySymbol}
              isLoading={isTrendLoading && !isRefreshing}
            />

            {/* Payment splits */}
            <SalesByPaymentCard
              salesSummary={summaryData}
              currencySymbol={currencySymbol}
              isLoading={isSummaryLoading && !isRefreshing}
              onNavigateToTab={setActiveTab}
            />

            {/* Order types splits */}
            <RevenueByOrderTypeCard
              orderTypeData={orderTypeData}
              netSales={netSales}
              currencySymbol={currencySymbol}
              isLoading={isOrderTypeLoading && !isRefreshing}
            />

            {/* Top performing items */}
            <TopProductsList
              itemList={itemData || EMPTY_ARRAY}
              currencySymbol={currencySymbol}
              isLoading={isItemLoading && !isRefreshing}
              onNavigateToTab={setActiveTab}
            />
          </View>
        )}

        {activeTab === "Daily" && (
          <View key="daily">
            {isDailyLoading && !isRefreshing ? (
              <SalesDailyListSkeleton />
            ) : (
              <SalesDailyList
                dailyList={dailySummaryData || EMPTY_ARRAY}
                currencySymbol={currencySymbol}
              />
            )}
          </View>
        )}

        {activeTab === "Items" && (
          <View key="items">
            {isItemLoading && !isRefreshing ? (
              <SalesItemListSkeleton />
            ) : (
              <SalesItemList
                itemList={itemData || EMPTY_ARRAY}
                currencySymbol={currencySymbol}
              />
            )}
          </View>
        )}

        {activeTab === "Hourly" && (
          <View key="hourly">
            {isHourlyLoading && !isRefreshing ? (
              <SalesHourlyListSkeleton />
            ) : (
              <SalesHourlyList
                hourlyList={hourlyData || EMPTY_ARRAY}
                currencySymbol={currencySymbol}
              />
            )}
          </View>
        )}
      </RefreshableScrollView>
    </SafeAreaView>
  );
};

export default SalesReport;
