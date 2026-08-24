// 1. React / React Native
import React, { useEffect, useState } from "react";
import { View } from "react-native";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components
import {
  FilterDrawer,
  IFilterField,
  PageTitle,
  ScreenContainer,
} from "@/components/reuseable";
import { useAuth } from "@/hooks";

// 5. Feature components/hooks
import { useRestaurantQuery } from "@/features/restaurants/hooks/queries/useRestaurantQueries";
import {
  KPICardGrid,
  RevenueByOrderTypeCard,
  SalesAreaChart,
  SalesByPaymentCard,
  SalesSummaryListCard,
  TopProductsList,
} from "../components";
import {
  useOrderSummaryQuery,
  usePaymentSummaryQuery,
  useSalesByItemQuery,
  useSalesByOrderTypeQuery,
  useSalesSummaryQuery,
  useSalesTrendQuery,
} from "../hooks/queries";

// 6. Types
import type { ISalesParams, ISalesTrendItem, ITopProductItem } from "../types";

// 7. Constants/utils
import { REPORT_KEYS } from "@/constants";
import { getCurrencySymbol, getDateRange } from "@/utils";

const FILTER_FIELDS: IFilterField[] = [
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

const EMPTY_TOP_PRODUCTS: readonly ITopProductItem[] = [];

const SalesReport = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const restaurantId =
    user?.restaurant && user.restaurant.length > 0
      ? String(user.restaurant[0]?.id)
      : String(user?.business_id || "");

  const { data: restaurantResponse } = useRestaurantQuery({
    restaurant_id: restaurantId,
  });
  const settings = restaurantResponse?.restaurant;
  const currencySymbol = getCurrencySymbol(settings?.currency);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterValues, setFilterValues] = useState(INITIAL_FILTER_VALUES);
  const [customGroupBy, setCustomGroupBy] = useState<
    "day" | "week" | "month" | null
  >(null);

  const { period, dateRange } = filterValues;
  const isCustomRange = Boolean(dateRange.start && dateRange.end);
  const defaultRange = isCustomRange ? null : getDateRange(period);

  const parentDefaultGroupBy = (period === "This Month" ? "week" : "day") as
    "day" | "week";

  // Reset customGroupBy whenever parent filter changes so chart obeys parent filter priority
  useEffect(() => {
    setCustomGroupBy(null);
  }, [filterValues]);

  const effectiveGroupBy = customGroupBy ?? parentDefaultGroupBy;

  const apiParams: ISalesParams = {
    restaurant_id: restaurantId,
    start_date: isCustomRange ? dateRange.start : defaultRange!.start_date,
    end_date: isCustomRange ? dateRange.end : defaultRange!.end_date,
    group_by: parentDefaultGroupBy,
  };

  // Fetch report data
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
  } = useSalesSummaryQuery(apiParams);

  const {
    data: paymentData,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
    isError: isPaymentError,
    refetch: refetchPayment,
  } = usePaymentSummaryQuery(apiParams);

  const {
    data: orderSummaryData,
    isLoading: isOrderSummaryLoading,
    isFetching: isOrderSummaryFetching,
  } = useOrderSummaryQuery(apiParams);

  const {
    data: trendData,
    isLoading: isTrendLoading,
    isFetching: isTrendFetching,
    isError: isTrendError,
    refetch: refetchTrend,
  } = useSalesTrendQuery({
    ...apiParams,
    group_by: effectiveGroupBy,
  });

  const {
    data: orderTypeData,
    isLoading: isOrderTypeLoading,
    isFetching: isOrderTypeFetching,
    isError: isOrderTypeError,
    refetch: refetchOrderType,
  } = useSalesByOrderTypeQuery(apiParams);

  const {
    data: itemData,
    isLoading: isItemLoading,
    isFetching: isItemFetching,
    isError: isItemError,
    refetch: refetchItem,
  } = useSalesByItemQuery(apiParams);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: REPORT_KEYS.all });
    setIsRefreshing(false);
  };

  const isKpiLoading =
    isSummaryLoading ||
    isSummaryFetching ||
    isOrderSummaryLoading ||
    isOrderSummaryFetching;

  const isSummaryCardLoading = isSummaryLoading || isSummaryFetching;
  const isPaymentCardLoading = isPaymentLoading || isPaymentFetching;
  const isTrendCardLoading = isTrendLoading || isTrendFetching;
  const isOrderTypeCardLoading = isOrderTypeLoading || isOrderTypeFetching;
  const isItemCardLoading = isItemLoading || isItemFetching;

  // Order summary metrics using strongly-typed response
  const totalOrders =
    orderSummaryData?.total_orders ?? summaryData?.total_orders ?? 0;
  const completedOrders = orderSummaryData?.completed_orders ?? 0;
  const pendingOrders = orderSummaryData?.pending?.total ?? 0;
  const cancelledOrders = orderSummaryData?.cancelled?.total ?? 0;
  const avgOrderValue =
    orderSummaryData?.sales?.average_order_value ??
    (totalOrders > 0 ? (summaryData?.gross_sales ?? 0) / totalOrders : 0);

  // Sales Summary Metrics using strongly-typed response
  const grossSales = summaryData?.gross_sales ?? 0;
  const discounts = summaryData?.discounts ?? 0;
  const netSales = summaryData?.net_sales ?? 0;
  const totalTax = summaryData?.total_tax ?? 0;
  const totalExpenses = summaryData?.total_expenses ?? 0;

  const sparklineData = Array.isArray(trendData)
    ? trendData.map((d: ISalesTrendItem) => Number(d.sales || 0))
    : [];

  return (
    <ScreenContainer onRefresh={handleRefresh} refreshing={isRefreshing}>
      {/* Header Title and Filter Trigger */}
      <PageTitle
        title="Sales Report"
        icon="bar-chart"
        description="Analyze your sales performance and trends"
      />

      <View className="flex items-end justify-center mb-3">
        <FilterDrawer
          fields={FILTER_FIELDS}
          values={filterValues}
          onApply={(values) =>
            setFilterValues(values as typeof INITIAL_FILTER_VALUES)
          }
          onClear={() => setFilterValues(INITIAL_FILTER_VALUES)}
        />
      </View>

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
          isLoading={isSummaryCardLoading}
        />

        {/* Daily/Weekly/Monthly Revenue Trend Chart */}
        <SalesAreaChart
          trendData={trendData}
          currencySymbol={currencySymbol}
          isLoading={isTrendCardLoading}
          isError={isTrendError}
          onRetry={refetchTrend}
          groupBy={effectiveGroupBy}
          onGroupByChange={setCustomGroupBy}
        />

        {/* Payment splits */}
        <SalesByPaymentCard
          paymentSummary={paymentData}
          currencySymbol={currencySymbol}
          isLoading={isPaymentCardLoading}
          isError={isPaymentError}
          onRetry={refetchPayment}
        />

        {/* Order types splits */}
        <RevenueByOrderTypeCard
          orderTypeData={orderTypeData}
          netSales={netSales}
          currencySymbol={currencySymbol}
          isLoading={isOrderTypeCardLoading}
          isError={isOrderTypeError}
          onRetry={refetchOrderType}
        />

        {/* Top performing items */}
        <TopProductsList
          itemList={itemData || (EMPTY_TOP_PRODUCTS as ITopProductItem[])}
          currencySymbol={currencySymbol}
          isLoading={isItemCardLoading}
          isError={isItemError}
          onRetry={refetchItem}
        />
      </View>
    </ScreenContainer>
  );
};

export default SalesReport;
