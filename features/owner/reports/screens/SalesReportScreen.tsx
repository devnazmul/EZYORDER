import KpiCard from "@/components/reports/KpiCard";
import RevenueByOrderTypeCard from "@/components/reports/RevenueByOrderTypeCard";
import SalesAreaChart from "@/components/reports/SalesAreaChart";
import SalesByPaymentCard from "@/components/reports/SalesByPaymentCard";
import SalesDailyList from "@/components/reports/SalesDailyList";
import SalesHourlyList from "@/components/reports/SalesHourlyList";
import SalesItemList from "@/components/reports/SalesItemList";
import SalesSummaryListCard from "@/components/reports/SalesSummaryListCard";
import TopProductsList from "@/components/reports/TopProductsList";
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
import { WP } from "@/utils/getResponsiveSizes";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      className="flex-1 bg-base-100 py-4"
      style={{ paddingHorizontal: WP("4%") }}
    >
      <RefreshableScrollView onRefresh={handleRefresh} refreshing={isRefreshing}>
        {/* Header Title and Filter Trigger */}
        <View className="flex-row justify-between items-center mb-4">
          <PageTitle
            title="Sales Report"
            icon="bar-chart"
            description="Analyze your sales performance and trends"
          />
        </View>

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
          containerClassName=" mb-5"
        />

        <View className="flex items-end justify-center">
          <FilterDrawer
            fields={filterFields}
            values={filterValues}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </View>

        {isAnyLoading && !isRefreshing && (
          <View className="py-10 justify-center items-center">
            <ActivityIndicator size="large" color="#DC2D2A" />
          </View>
        )}

        {!isAnyLoading && activeTab === "Overview" && (
          <View key="overview">
            <View className="gap-y-3 mb-6">
              <KpiCard
                variant="dark"
                title="Total Sales"
                value={formatAmount(grossSales, currencySymbol)}
                trendText="+12.5% vs last period"
                trendType="up"
              />
              <View className="flex-row gap-3">
                <KpiCard
                  title="Total Orders"
                  value={totalOrders.toLocaleString()}
                  iconName="shopping-bag"
                  containerClassName="flex-1"
                />
                <KpiCard
                  title="Avg Order Value"
                  value={formatAmount(avgOrderValue, currencySymbol)}
                  iconName="payments"
                  containerClassName="flex-1"
                />
              </View>
              <View className="flex-row gap-3">
                <KpiCard
                  title="Total Discounts"
                  value={formatAmount(discounts, currencySymbol)}
                  iconName="local-offer"
                  containerClassName="flex-1"
                />
                <KpiCard
                  title="Net Sales"
                  value={formatAmount(netSales, currencySymbol)}
                  iconName="account-balance-wallet"
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
              containerClassName="mb-6"
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
