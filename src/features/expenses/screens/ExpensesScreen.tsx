// 1. React / React Native
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";

// 4. Shared components
import { EmptyState, PageTitle, ScreenContainer } from "@/components/reuseable";

// 5. Feature components / hooks
import {
  ExpenseCard,
  ExpenseCardSkeleton,
  ExpenseDetailModal,
  ExpenseFilterPanel,
  ExpenseKPICards,
  ExpensePaymentBreakdownCard,
  ExpenseTrendCard,
} from "../components";
import { useExpenses } from "../hooks/useExpenses";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { HP } from "@/utils/getResponsiveSizes";

export default function ExpensesScreen() {
  const {
    searchQuery,
    setSearchQuery,
    filterValues,
    setFilterValues,
    selectedExpense,
    setSelectedExpense,
    isRefreshing,
    expenses,
    expenseTypes,
    paymentMethodBreakdownChartData,
    isPaymentBreakdownLoading,
    isPaymentBreakdownError,
    refetchPaymentBreakdown,
    expenseTrendData,
    isExpenseTrendLoading,
    isExpenseTrendError,
    refetchExpenseTrend,
    currencySymbol,
    isLoading,
    handleRefresh,
    defaultFilters,
  } = useExpenses();

  const renderHeader = () => (
    <View className="gap-y-3 pb-3">
      {/* Page Title */}
      <PageTitle
        title="Expenses"
        icon="receipt-long"
        badgeCount={expenses.length}
        description="Track and manage your restaurant expenses and categories"
      />

      {/* Search & Filter Panel */}
      <ExpenseFilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        defaultFilters={defaultFilters}
        expenseTypes={expenseTypes}
      />

      {/* Expense KPI Cards */}
      <ExpenseKPICards
        startDate={filterValues.date_range?.start}
        endDate={filterValues.date_range?.end}
        currencySymbol={currencySymbol}
        isLoading={isRefreshing || isLoading}
      />

      {/* Expense Payment Method Breakdown */}
      <ExpensePaymentBreakdownCard
        data={paymentMethodBreakdownChartData}
        currencySymbol={currencySymbol}
        isLoading={isPaymentBreakdownLoading || isRefreshing}
        isError={isPaymentBreakdownError}
        onRetry={refetchPaymentBreakdown}
      />

      {/* Expense Trend */}
      <ExpenseTrendCard
        data={expenseTrendData}
        currencySymbol={currencySymbol}
        isLoading={isExpenseTrendLoading || isRefreshing}
        isError={isExpenseTrendError}
        onRetry={refetchExpenseTrend}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (isLoading && !isRefreshing) {
      return <ExpenseCardSkeleton count={5} />;
    }

    const emptyDescription = searchQuery
      ? "No expense records match your search criteria."
      : "No expense records exist in this workspace.";

    return (
      <EmptyState
        icon="receipt"
        title="No Expenses Found"
        description={emptyDescription}
      />
    );
  };

  return (
    <ScreenContainer scrollable={false} safeAreaEdges={["left"]}>
      <FlatList
        data={isLoading && !isRefreshing ? [] : expenses}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: HP("6%") }}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            expenseTypes={expenseTypes}
            currencySymbol={currencySymbol}
            onPress={() => setSelectedExpense(item)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Expense Detail Bottom Drawer Sheet */}
      <ExpenseDetailModal
        visible={selectedExpense !== null}
        onClose={() => setSelectedExpense(null)}
        expense={selectedExpense}
        expenseTypes={expenseTypes}
        currencySymbol={currencySymbol}
      />
    </ScreenContainer>
  );
}
