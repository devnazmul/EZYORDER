// 1. React / React Native
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

// 3. External libraries
import { SafeAreaView } from "react-native-safe-area-context";

// 4. Shared components
import { EmptyState, ErrorState, PageTitle } from "@/components/reuseable";

// 5. Feature components/hooks
import {
  OrderCard,
  OrderCardSkeleton,
  OwnerOrderDetailsDrawer,
} from "@/features/components/order";
import { OrderFilterPanel } from "@/features/order";
import {
  OrderReportKPIGrid,
  OrderSalesMetricsCard,
  OrderStatusDistributionCard,
} from "../components";
import { useOrdersReport } from "../hooks/useOrdersReport";

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
    isOrdersError,
    isRefreshing,
    handleRefresh,
    setSearchQuery,
    setFilterValues,
    setSelectedOrder,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
        filterValues={filterValues}
        setFilterValues={setFilterValues}
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

  const handleEndReached = () => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      !isOrdersLoading &&
      !isOrdersError
    ) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <View className="flex-1 px-4 pt-4">
        <FlatList
          key="orders-report-list"
          data={
            isOrdersLoading && !isFetchingNextPage && !isRefreshing
              ? []
              : orders
          }
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: HP("6%") }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <OrderCard
              item={item}
              onViewDetails={() => setSelectedOrder(item)}
            />
          )}
          ListFooterComponent={
            isOrdersLoading && !isFetchingNextPage && !isRefreshing ? (
              <View key="initial-loading-skeletons">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
              </View>
            ) : isFetchingNextPage ? (
              <View key="next-page-loading-skeleton" className="py-2">
                <OrderCardSkeleton />
              </View>
            ) : null
          }
          ListEmptyComponent={
            isOrdersError ? (
              <View key="error-state" className="py-6">
                <ErrorState
                  title="Failed to Load Orders"
                  message="We couldn't retrieve the orders list. Please check your connection and try again."
                  onRetry={handleRefresh}
                  retryLabel="Retry"
                  pyClassName="py-4"
                />
              </View>
            ) : !isOrdersLoading && !isRefreshing && !isFetchingNextPage ? (
              <View key="empty" className="py-8">
                <EmptyState
                  icon="receipt-long"
                  title="No Orders Found"
                  description="No orders match the specified search keywords, filters, or date range."
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
