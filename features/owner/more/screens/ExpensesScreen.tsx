import {
  EmptyState,
  FilterDrawer,
  PageTitle,
  RefreshableScrollView,
  SearchBar,
} from "@/components/reuseable";

import { useAuth } from "@/context/AuthContext";
import { ExpenseCard, ExpenseDetailModal } from "../components";

import {
  useExpensesQuery,
  useExpenseTypesQuery,
} from "@/features/owner/more/hooks/queries/useExpenseQueries";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_FILTERS = {
  date_range: { start: "", end: "" },
  amount_range: { min: "", max: "" },
  payment_method: "all",
  order_by: "",
};

export default function ExpensesScreen() {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [filterValues, setFilterValues] =
    useState<Record<string, any>>(DEFAULT_FILTERS);
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);

  // Construct API params for server-side filtering
  const apiParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (debouncedSearchQuery.trim() !== "") {
      params.search_key = debouncedSearchQuery.trim();
    }

    if (filterValues.date_range?.start) {
      params.start_date = filterValues.date_range.start;
    }

    if (filterValues.date_range?.end) {
      params.end_date = filterValues.date_range.end;
    }

    if (filterValues.amount_range?.min) {
      params.min_amount = filterValues.amount_range.min;
    }

    if (filterValues.amount_range?.max) {
      params.max_amount = filterValues.amount_range.max;
    }

    if (filterValues.payment_method !== "all") {
      params.payment_method = filterValues.payment_method;
    }

    if (filterValues.order_by) {
      params.order_by = filterValues.order_by.toUpperCase();
    }

    return params;
  }, [debouncedSearchQuery, filterValues]);

  // Fetch Expenses List using Server-Side query params
  const {
    data: expensesResponse,
    isLoading: isExpensesLoading,
    refetch: refetchExpenses,
  } = useExpensesQuery(token || "", restaurantId || "", 200, apiParams);

  // Fetch Expense Types ( for category/type details display)
  const { data: typesResponse, isLoading: isTypesLoading } =
    useExpenseTypesQuery(token || "", restaurantId || "", 1000);

  // Extract raw lists
  const expenses = useMemo(() => {
    if (!expensesResponse) return [];
    if (Array.isArray(expensesResponse)) return expensesResponse;
    if (Array.isArray(expensesResponse.data)) return expensesResponse.data;
    if (expensesResponse.data && Array.isArray(expensesResponse.data.data))
      return expensesResponse.data.data;
    return [];
  }, [expensesResponse]);

  const expenseTypes = useMemo(() => {
    if (!typesResponse) return [];
    if (Array.isArray(typesResponse)) return typesResponse;
    if (Array.isArray(typesResponse.data)) return typesResponse.data;
    if (typesResponse.data && Array.isArray(typesResponse.data.data))
      return typesResponse.data.data;
    return [];
  }, [typesResponse]);

  // Configure FilterDrawer fields
  const filterFields = useMemo(() => {
    return [
      {
        id: "date_range",
        label: "Payment Date Range",
        type: "date-range" as const,
      },
      {
        id: "amount_range",
        label: "Amount Range",
        type: "number-range" as const,
      },
      {
        id: "payment_method",
        label: "Payment Method",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Methods" },
          { id: "cash", label: "Cash" },
          { id: "card", label: "Card" },
          { id: "bank_transfer", label: "Bank Transfer" },
        ],
      },
      {
        id: "order_by",
        label: "Sort Order",
        type: "chips" as const,
        options: [
          { id: "desc", label: "Newest First" },
          { id: "asc", label: "Oldest First" },
        ],
      },
    ];
  }, []);

  const handleApplyFilters = (newValues: Record<string, any>) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterValues.date_range?.start || filterValues.date_range?.end) count++;
    if (filterValues.amount_range?.min || filterValues.amount_range?.max)
      count++;
    if (filterValues.payment_method !== "all") count++;
    if (filterValues.order_by !== "desc") count++;
    return count;
  }, [filterValues]);

  const handleRefresh = async () => {
    await refetchExpenses();
  };

  const isLoading = isExpensesLoading || isTypesLoading;

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      className="flex-1 bg-base-100"
    >
      {/* App Header with Back Button */}

      <RefreshableScrollView
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/*  Page Title */}
        <PageTitle
          title="Expenses"
          icon="receipt-long"
          badgeCount={expenses.length}
        />

        {/* Search & Filter Drawer Row */}
        <View className="flex-row items-center gap-3 mb-4">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search expenses..."
            containerClassName="flex-1"
          />
          <FilterDrawer
            fields={filterFields}
            values={filterValues}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </View>

        {/* Active Filter Badge count indicator */}
        {(searchQuery.trim() !== "" || activeFilterCount > 0) && (
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">
              Matching {expenses.length} Expenses
            </Text>
          </View>
        )}

        {/* Expenses List */}
        <View className="mt-2">
          {isLoading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2D2A" />
              <Text className="mt-3 text-xs font-semibold text-accent">
                Loading expenses...
              </Text>
            </View>
          ) : expenses.length > 0 ? (
            expenses.map((item: any) => (
              <ExpenseCard
                key={item.id}
                expense={item}
                expenseTypes={expenseTypes}
                onPress={() => setSelectedExpense(item)}
              />
            ))
          ) : (
            <EmptyState
              icon="receipt"
              title="No Expenses Found"
              description={
                searchQuery || activeFilterCount > 0
                  ? "No expense records match your search or filter criteria."
                  : "No expense records exist in this workspace."
              }
            />
          )}
        </View>
      </RefreshableScrollView>

      {/* Expense Detail Bottom Drawer Sheet */}
      <ExpenseDetailModal
        visible={selectedExpense !== null}
        onClose={() => setSelectedExpense(null)}
        expense={selectedExpense}
        expenseTypes={expenseTypes}
      />
    </SafeAreaView>
  );
}
