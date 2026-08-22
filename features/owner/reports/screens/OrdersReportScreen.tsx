import {
  EmptyState,
  FilterDrawer,
  IFilterField,
  PageTitle,
  SearchBar,
} from "@/components/reuseable";
import { COLORS } from "@/constants";
import {
  OrderCard,
  OrderCardSkeleton,
  OwnerOrderDetailsDrawer,
} from "@/features/owner/components/order";
import { useAuth } from "@/hooks";
import { useRestaurantQuery } from "@/shared/hooks";

import { getCurrencySymbol, getDateRange, HP } from "@/utils";

import React, { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  OrderReportKPIGrid,
  OrderSalesMetricsCard,
  OrderStatusDistributionCard,
} from "../components";
import {
  useOrdersReportListQuery,
  useOrderSummaryQuery,
} from "../hooks/queries";
import { IOrder, IOrdersReportParams } from "../types";

export interface IOrderReportFilterValues {
  period: string;
  dateRange: {
    start_date: string;
    end_date: string;
  };
  status: string[];
  type: string[];
  amount_range: { min: string; max: string };
  customer_name: string;
  customer_phone: string;
  table_number: string;
}

const initialRange = getDateRange("This Month");
const INITIAL_FILTER_VALUES: IOrderReportFilterValues = {
  period: "This Month",
  dateRange: {
    start_date: initialRange.start_date,
    end_date: initialRange.end_date,
  },
  status: ["all"],
  type: ["all"],
  amount_range: { min: "", max: "" },
  customer_name: "",
  customer_phone: "",
  table_number: "",
};

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
      { id: "All Time", label: "All Time" },
    ],
    onFieldChange: (selectedPeriod: unknown) => {
      const periodKey =
        typeof selectedPeriod === "string" ? selectedPeriod : "This Month";
      const range = getDateRange(periodKey);
      return {
        dateRange: {
          start_date: range.start_date,
          end_date: range.end_date,
        },
      };
    },
  },
  {
    id: "dateRange",
    label: "Custom Date Range",
    type: "date-range",
  },
  {
    id: "status",
    label: "Order Status",
    type: "chips",
    isMultiSelect: true,
    options: [
      { id: "all", label: "All Statuses" },
      { id: "pending", label: "Pending" },
      { id: "completed", label: "Completed" },
      { id: "kitchen", label: "Kitchen" },
    ],
  },
  {
    id: "type",
    label: "Order Type",
    type: "chips",
    isMultiSelect: true,
    options: [
      { id: "all", label: "All Channels" },
      { id: "eat_in", label: "Eat In" },
      { id: "delivery", label: "Delivery" },
      { id: "take_away", label: "Take Away" },
      { id: "walk_in", label: "Walk In" },
    ],
  },
  {
    id: "amount_range",
    label: "Amount Range",
    type: "number-range",
  },
  {
    id: "customer_name",
    label: "Customer Name",
    type: "text",
  },
  {
    id: "customer_phone",
    label: "Customer Phone",
    type: "text",
    keyboardType: "phone-pad",
  },
  {
    id: "table_number",
    label: "Table Number",
    type: "text",
    keyboardType: "numeric",
  },
];

const buildOrdersListParams = (
  restaurantId: string,
  page: number,
  resolvedDateRange: { start_date: string; end_date: string },
  searchQuery: string,
  filterValues: IOrderReportFilterValues,
): IOrdersReportParams => {
  const p: IOrdersReportParams = {
    restaurant_id: restaurantId,
    per_page: 15,
    page,
    from_date: resolvedDateRange.start_date,
    to_date: resolvedDateRange.end_date,
    search_key: searchQuery.trim(),
  };

  if (
    filterValues.status &&
    !filterValues.status.includes("all") &&
    filterValues.status.length > 0
  ) {
    p.status = filterValues.status.join(",");
  }

  if (
    filterValues.type &&
    !filterValues.type.includes("all") &&
    filterValues.type.length > 0
  ) {
    p.type = filterValues.type.join(",");
  }

  if (filterValues.amount_range?.min) {
    p.min_amount = filterValues.amount_range.min;
  }
  if (filterValues.amount_range?.max) {
    p.max_amount = filterValues.amount_range.max;
  }
  if (filterValues.customer_name) {
    p.customer_name = filterValues.customer_name;
  }
  if (filterValues.customer_phone) {
    p.customer_phone = filterValues.customer_phone;
  }
  if (filterValues.table_number) {
    p.table_number = filterValues.table_number;
  }

  return p;
};

export default function OrdersReportScreen() {
  const { user } = useAuth();

  const restaurantId =
    user?.restaurant?.length > 0
      ? String(user?.restaurant[0]?.id)
      : String(user?.business_id || "1");

  // Query: Restaurant Settings (Cached via TanStack Query)
  const { data: restaurantResponse } = useRestaurantQuery({
    restaurant_id: restaurantId,
  });
  const settings = restaurantResponse?.restaurant;
  const currencySymbol = getCurrencySymbol(settings?.currency);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<IOrderReportFilterValues>(
    INITIAL_FILTER_VALUES,
  );
  const [page, setPage] = useState(1);

  // Selected Order for Read-Only Details Drawer
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const { period, dateRange } = filterValues;
  const isCustomRange = Boolean(dateRange?.start_date && dateRange?.end_date);
  const resolvedDateRange = isCustomRange ? dateRange : getDateRange(period);

  // API Params for Summary & Type Report
  const summaryParams = {
    restaurant_id: restaurantId,
    start_date: resolvedDateRange.start_date,
    end_date: resolvedDateRange.end_date,
  };

  // Query: Order Summary
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching: isRefetchingSummary,
  } = useOrderSummaryQuery(summaryParams);

  // API Params for Paginated Orders List
  const ordersListParams = buildOrdersListParams(
    restaurantId,
    page,
    resolvedDateRange,
    searchQuery,
    filterValues,
  );

  // Query: Paginated Orders List
  // FIXME: In coming versions, migrate this query to either useInfiniteQuery for infinite scroll or implement trigger-based "Load More" pagination.
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
    isRefetching: isRefetchingOrders,
  } = useOrdersReportListQuery(ordersListParams);

  const orders = ordersResponse?.data || [];
  const totalOrdersCount = ordersResponse?.meta?.total ?? orders.length;

  const isRefreshing = isRefetchingSummary || isRefetchingOrders;

  const handleRefresh = async () => {
    await Promise.allSettled([refetchSummary(), refetchOrders()]);
  };

  const renderHeader = () => (
    <View className="gap-y-5 mb-4">
      {/* Header Info */}
      <PageTitle
        title="Orders Report"
        description="Comprehensive analytics on order volumes, status distributions, channel sales, and history."
        icon="receipt"
      />

      {/* Search Bar & Filter Drawer Trigger */}
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <SearchBar
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setPage(1);
            }}
            placeholder="Search by ID, customer name, phone..."
          />
        </View>
        <FilterDrawer
          fields={FILTER_FIELDS}
          values={filterValues as unknown as Record<string, unknown>}
          onApply={(newFilters) => {
            setFilterValues(newFilters as unknown as IOrderReportFilterValues);
            setPage(1);
          }}
          onClear={() => {
            setFilterValues(INITIAL_FILTER_VALUES);
            setSearchQuery("");
            setPage(1);
          }}
        />
      </View>

      {/* KPI Cards Grid */}
      <OrderReportKPIGrid
        summaryData={summaryData}
        currencySymbol={currencySymbol}
        isLoading={isSummaryLoading || isRefreshing}
      />

      {/* Status & Sales Charts */}
      <OrderStatusDistributionCard
        summaryData={summaryData}
        isLoading={isSummaryLoading || isRefreshing}
      />

      <OrderSalesMetricsCard
        summaryData={summaryData}
        currencySymbol={currencySymbol}
        isLoading={isSummaryLoading || isRefreshing}
      />

      {/* Section Divider & Heading for Order List */}
      <View className="flex-row justify-between items-center pt-2">
        <Text
          style={{ fontSize: 16 }}
          className="font-bold text-neutral capitalize"
        >
          Orders List
        </Text>
        <Text style={{ fontSize: 12 }} className="font-semibold text-accent">
          {totalOrdersCount} {totalOrdersCount === 1 ? "Order" : "Orders"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <View className="flex-1 px-4 pt-4">
        {/*
          FIXME: [Note]
          I plan to implement the next page functionality (using either infinite scroll with
          useInfiniteQuery / onEndReached or a dedicated "Load More" button) in the next stage.
        */}
        <FlatList
          key="orders-report-list"
          data={isOrdersLoading || isRefreshing ? [] : orders}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: HP("6%") }}
          renderItem={({ item }) => (
            <OrderCard
              item={item}
              onViewDetails={() => setSelectedOrder(item)}
            />
          )}
          ListFooterComponent={
            isOrdersLoading || isRefreshing ? (
              <View key="loading-skeletons">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isOrdersLoading && !isRefreshing ? (
              <View key="empty" className="py-8">
                <EmptyState
                  description="No orders found matching the specified filters or date range."
                  pyClassName="py-6"
                />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      </View>

      {/* Read-Only Order Details BottomSheet Modal */}
      <OwnerOrderDetailsDrawer
        visible={selectedOrder !== null}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        currencySymbol={currencySymbol}
      />
    </SafeAreaView>
  );
}
