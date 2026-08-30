// 1. React / React Native
import React from "react";
import { View } from "react-native";

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
} from "../components";
import { useExpenses } from "../hooks/useExpenses";

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
    currencySymbol,
    isLoading,
    handleRefresh,
    defaultFilters,
  } = useExpenses();

  const renderListContent = () => {
    if (isLoading || isRefreshing) {
      return <ExpenseCardSkeleton count={5} />;
    }

    if (expenses.length > 0) {
      return expenses.map((item) => (
        <ExpenseCard
          key={item.id}
          expense={item}
          expenseTypes={expenseTypes}
          currencySymbol={currencySymbol}
          onPress={() => setSelectedExpense(item)}
        />
      ));
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
    <ScreenContainer
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      safeAreaEdges={["left"]}
    >
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
      />

      {/* Expense KPI Cards */}
      <ExpenseKPICards
        startDate={filterValues.date_range?.start}
        endDate={filterValues.date_range?.end}
        currencySymbol={currencySymbol}
      />

      {/* Expense Payment Method Breakdown */}
      <View className="my-2">
        <ExpensePaymentBreakdownCard
          data={paymentMethodBreakdownChartData}
          currencySymbol={currencySymbol}
          isLoading={isPaymentBreakdownLoading}
          isError={isPaymentBreakdownError}
          onRetry={refetchPaymentBreakdown}
        />
      </View>

      {/* Expenses List */}
      <View className="mt-1">{renderListContent()}</View>

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
