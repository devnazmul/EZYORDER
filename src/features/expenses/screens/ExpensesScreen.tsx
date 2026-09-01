// 1. React / React Native
import React, { useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import { EmptyState, PageTitle, ScreenContainer } from "@/components/reuseable";

// 5. Feature components / hooks
import {
  ExpenseCard,
  ExpenseCardSkeleton,
  ExpenseDetailBottomSheet,
  ExpenseFilterPanel,
  ExpenseFormBottomSheet,
  ExpenseKPICards,
  ExpensePaymentBreakdownCard,
  ExpenseTrendCard,
} from "../components";
import { useExpenses } from "../hooks/useExpenses";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { HP, WP } from "@/utils/getResponsiveSizes";
import { IExpense } from "../types";

export default function ExpensesScreen() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<IExpense | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    filterValues,
    setFilterValues,
    selectedExpense,
    setSelectedExpense,
    isRefreshing,
    expenses,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

  const handleSelectExpense = (item: IExpense) => {
    setSelectedExpense(item);
  };

  const handleEditExpense = (item: IExpense) => {
    setEditingExpense(item);
    setIsFormOpen(true);
  };

  const handleCreateExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="mt-3">
        <ExpenseCardSkeleton count={3} />
      </View>
    );
  };

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

  const renderItem = ({ item }: { item: IExpense }) => (
    <ExpenseCard
      expense={item}
      expenseTypes={expenseTypes}
      currencySymbol={currencySymbol}
      onPress={() => handleSelectExpense(item)}
      onEdit={handleEditExpense}
    />
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
    <ScreenContainer
      scrollable={false}
      safeAreaEdges={["left"]}
      contentClassName="flex-1 relative"
    >
      <FlatList
        className="flex-1"
        data={isLoading && !isRefreshing ? [] : expenses}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: HP("10%") }}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Floating Action Button (FAB) for Adding Expense */}
      <TouchableOpacity
        onPress={handleCreateExpense}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Add New Expense"
        style={{
          position: "absolute",
          bottom: 20,
          right: 5,
          width: WP("12%"),
          height: WP("12%"),
          borderRadius: WP("6%"),
          elevation: 6,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
        }}
        className="z-50 bg-primary items-center justify-center shadow-lg"
      >
        <MaterialIcons name="add" size={WP("7%")} color={COLORS.base300} />
      </TouchableOpacity>

      {/* Expense Detail Bottom Drawer Sheet */}
      <ExpenseDetailBottomSheet
        visible={selectedExpense !== null}
        onClose={() => setSelectedExpense(null)}
        expense={selectedExpense}
        expenseTypes={expenseTypes}
        currencySymbol={currencySymbol}
      />

      {/* Expense Create / Edit Form BottomSheet */}
      <ExpenseFormBottomSheet
        visible={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        initialExpense={editingExpense}
      />
    </ScreenContainer>
  );
}
