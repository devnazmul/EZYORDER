import {
  FilterDrawer,
  IFilterField,
  PageTitle,
  RefreshableScrollView,
  ToggleBar,
} from "@/components/reuseable";
import { useAuth, useData } from "@/hooks";
import { getCurrencySymbol, WP } from "@/utils";
import dayjs from "dayjs";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  KPICardGrid,
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
  useOrderSummaryQuery,
  useSalesByItemQuery,
  useSalesByOrderTypeQuery,
  useSalesDailySummaryQuery,
  useSalesHourlyQuery,
  useSalesSummaryQuery,
  useSalesTrendQuery,
} from "../hooks/queries";

// Helper: Calculate Date Period Ranges aligned with calendar boundaries using dayjs
const getDateRange = (period: string) => {
  const now = dayjs();

  if (period === "Yesterday") {
    const yesterday = now.subtract(1, "day");
    return {
      start_date: yesterday.format("YYYY-MM-DD"),
      end_date: yesterday.format("YYYY-MM-DD"),
    };
  }

  if (period === "This Week") {
    return {
      start_date: now.startOf("week").format("YYYY-MM-DD"),
      end_date: now.endOf("week").format("YYYY-MM-DD"),
    };
  }

  if (period === "This Month") {
    return {
      start_date: now.startOf("month").format("YYYY-MM-DD"),
      end_date: now.endOf("month").format("YYYY-MM-DD"),
    };
  }

  return {
    start_date: now.format("YYYY-MM-DD"),
    end_date: now.format("YYYY-MM-DD"),
  };
};

const filterFields: IFilterField[] = [
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
    onFieldChange: (selectedPeriod: unknown) => {
      const range = getDateRange(String(selectedPeriod));
      return {
        dateRange: {
          start: range.start_date,
          end: range.end_date,
        },
      };
    },
  },
  {
    id: "dateRange",
    label: "Custom Date Range",
    type: "date-range",
  },
];

const initialWeekRange = getDateRange("This Week");
const INITIAL_FILTER_VALUES = {
  period: "This Week",
  dateRange: {
    start: initialWeekRange.start_date,
    end: initialWeekRange.end_date,
  },
};

const EMPTY_ARRAY: readonly never[] = [];

const SalesReport = () => {
  const { user } = useAuth();
  const { settings } = useData();
  const currencySymbol = getCurrencySymbol(settings?.currency);

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
    data: orderSummaryData,
    isLoading: isOrderSummaryLoading,
    refetch: refetchOrderSummary,
  } = useOrderSummaryQuery(apiParams);

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
      refetchOrderSummary(),
      refetchTrend(),
      refetchOrderType(),
      refetchItem(),
      refetchHourly(),
      refetchDaily(),
    ]);
    setIsRefreshing(false);
  };

  const isKpiLoading =
    (isSummaryLoading || isOrderSummaryLoading) && !isRefreshing;

  // Order summary metrics
  const orderStats = orderSummaryData || {};
  const totalOrders = orderStats.total_orders ?? summaryData?.total_orders ?? 0;
  const completedOrders = orderStats.completed_orders ?? 0;
  const pendingOrders = orderStats.pending?.total ?? 0;
  const cancelledOrders = orderStats.cancelled?.total ?? 0;
  const avgOrderValue =
    orderStats.sales?.average_order_value ??
    (totalOrders > 0 ? (summaryData?.gross_sales ?? 0) / totalOrders : 0);

  // Sales Summary Metrics
  const grossSales = summaryData?.gross_sales ?? 0;
  const discounts = summaryData?.discounts ?? 0;
  const netSales = summaryData?.net_sales ?? 0;
  const totalTax = summaryData?.total_tax ?? summaryData?.tax ?? 0;
  const totalExpenses =
    summaryData?.total_expenses ?? summaryData?.expenses ?? 0;

  const sparklineData = Array.isArray(trendData)
    ? trendData.map((d: { sales?: number | string }) => Number(d.sales || 0))
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
            <KPICardGrid
              grossSales={grossSales}
              totalOrders={totalOrders}
              completedOrders={completedOrders}
              pendingOrders={pendingOrders}
              cancelledOrders={cancelledOrders}
              avgOrderValue={avgOrderValue}
              discounts={discounts}
              netSales={netSales}
              totalTax={totalTax}
              totalExpenses={totalExpenses}
              sparklineData={sparklineData}
              currencySymbol={currencySymbol}
              isLoading={isKpiLoading}
            />

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
