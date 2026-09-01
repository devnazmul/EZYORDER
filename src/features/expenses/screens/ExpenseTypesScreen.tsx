// 1. React / React Native
import React from "react";
import { FlatList, View } from "react-native";

// 4. Shared components
import {
  EmptyState,
  ErrorState,
  FloatingButton,
  PageTitle,
  ScreenContainer,
} from "@/components/reuseable";

// 5. Feature components / hooks
import {
  ExpenseTypeCard,
  ExpenseTypeDetailBottomSheet,
  ExpenseTypeFormBottomSheet,
} from "../components";
import ExpenseTypeCardSkeleton from "../components/skeletons/ExpenseTypeCardSkeleton";
import { useExpenseTypes } from "../hooks";

// 7. Constants/utils
import { HP } from "@/utils/getResponsiveSizes";

export default function ExpenseTypesScreen() {
  const {
    expenseTypesList,
    selectedExpenseType,
    setSelectedExpenseType,
    isFormOpen,
    editingExpenseType,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    isRefreshing,
    handleRefresh,
    handleLoadMore,
    handleCreate,
    handleEdit,
    handleDelete,
    closeForm,
  } = useExpenseTypes();

  const renderHeader = () => (
    <View className="mb-3">
      <PageTitle
        icon="receipt-long"
        title="Expense Types"
        description="All Expense types"
      />
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-2">
        <ExpenseTypeCardSkeleton count={3} />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading || (isFetching && !isFetchingNextPage)) {
      return <ExpenseTypeCardSkeleton count={5} />;
    }

    if (isError) {
      return (
        <View className="bg-base-300 border border-base-200 rounded-xl p-6 items-center justify-center">
          <ErrorState
            title="Failed to Load Expense Types"
            message="Unable to fetch expense types."
            onRetry={handleRefresh}
          />
        </View>
      );
    }

    return (
      <View className="bg-base-300 border border-base-200 rounded-xl p-8 items-center justify-center">
        <EmptyState
          icon="receipt"
          title="No Expense Types Found"
          description="No expense types are registered for this restaurant."
        />
      </View>
    );
  };

  return (
    <ScreenContainer
      scrollable={false}
      safeAreaEdges={["left", "right"]}
      contentClassName="flex-1 relative"
    >
      <FlatList
        data={isLoading || isError ? [] : expenseTypesList}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: HP("10%") }}
        contentContainerClassName="gap-y-3"
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <ExpenseTypeCard
            expenseType={item}
            onPress={() => setSelectedExpenseType(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
      />

      {/* Reusable Floating Action Button */}
      <FloatingButton
        icon="add"
        position="bottom-right"
        onPress={handleCreate}
        accessibilityLabel="Add Expense Type"
      />

      {/* Detail Bottom Sheet */}
      <ExpenseTypeDetailBottomSheet
        visible={!!selectedExpenseType}
        onClose={() => setSelectedExpenseType(null)}
        expenseType={selectedExpenseType}
        onEdit={
          selectedExpenseType
            ? () => handleEdit(selectedExpenseType)
            : undefined
        }
      />

      {/* Form Bottom Sheet */}
      <ExpenseTypeFormBottomSheet
        visible={isFormOpen}
        onClose={closeForm}
        initialExpenseType={editingExpenseType}
      />
    </ScreenContainer>
  );
}
