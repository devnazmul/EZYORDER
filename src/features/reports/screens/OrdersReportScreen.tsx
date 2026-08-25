// 1. React / React Native
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

// 3. External libraries
import { SafeAreaView } from "react-native-safe-area-context";

// 4. Shared components
import { EmptyState, PageTitle } from "@/components/reuseable";

// 5. Feature components/hooks
import {
  OrderCard,
  OrderCardSkeleton,
  OwnerOrderDetailsDrawer,
} from "@/features/components/order";
import { IOrderFilterValues, OrderFilterPanel } from "@/features/order";
import {
  OrderReportKPIGrid,
  OrderSalesMetricsCard,
  OrderStatusDistributionCard,
} from "../components";
import { useOrdersReport } from "../hooks/useOrdersReport";

// 6. Types
import { type IOrderReportFilterValues } from "../state/ordersReport.reducer";

// 7. Constants/utils
import { COLORS } from "@/constants";
import { HP } from "@/utils";

export default function OrdersReportScreen() {
  const {
    searchQuery,
    filterValues,
    selectedOrder,
    summaryData,
    currencySymbol,
    orders,
    totalOrdersCount,
    isSummaryLoading,
    isOrdersLoading,
    isRefreshing,
    handleRefresh,
    setSearchQuery,
    setFilterValues,
    setSelectedOrder,
  } = useOrdersReport();

  const renderHeader = () => (
    <View className="gap-y-5 mb-4">
      {/* Header Info */}
      <PageTitle
        title="Orders Report"
        description="Comprehensive analytics on order volumes, status distributions, channel sales, and history."
        icon="receipt"
      />

      {/* Search Bar & Filter Drawer Panel */}
      <OrderFilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterValues={filterValues as IOrderFilterValues}
        setFilterValues={(newFilters) =>
          setFilterValues(newFilters as IOrderReportFilterValues)
        }
      />

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
        <Text className="text-base font-bold text-neutral capitalize">
          Orders List
        </Text>
        <Text className="text-xs font-semibold text-accent">
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
