// 1. React / React Native
import { useMemo, useReducer } from "react";

// 3. External libraries / Shared hooks / Shared context
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/src/context/AuthContext";

// 5. Feature components/hooks/services/state
import { useRestaurantQuery } from "@/features/restaurants/hooks/queries/useRestaurantQueries";
import { ExpenseService } from "../services/expense.service";
import {
  DEFAULT_EXPENSE_FILTERS,
  expensesReducer,
  type IExpensesState,
} from "../state/expenses.reducer";
import {
  useExpensesQuery,
  useExpenseTypesQuery,
} from "./queries/useExpenseQueries";

// 6. Types
import type { IExpenseFilterValues } from "../schema";
import type { IExpense } from "../types";

// 7. Constants/utils
import { getCurrencySymbol } from "@/utils";

const INITIAL_STATE: IExpensesState = {
  searchQuery: "",
  filterValues: DEFAULT_EXPENSE_FILTERS,
  selectedExpense: null,
  isRefreshing: false,
};

export function useExpenses() {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [state, dispatch] = useReducer(expensesReducer, INITIAL_STATE);
  const debouncedSearchQuery = useDebounce(state.searchQuery, 400);

  const { data: restaurantResponse } = useRestaurantQuery({
    restaurant_id: String(restaurantId || ""),
  });
  const currencySymbol = getCurrencySymbol(
    restaurantResponse?.restaurant?.currency,
  );

  const apiParams = useMemo(
    () =>
      ExpenseService.buildApiParams(debouncedSearchQuery, state.filterValues),
    [debouncedSearchQuery, state.filterValues],
  );

  const {
    data: expensesResponse,
    isLoading: isExpensesLoading,
    refetch: refetchExpenses,
  } = useExpensesQuery(restaurantId || "", 200, apiParams);

  const { data: typesResponse, isLoading: isTypesLoading } =
    useExpenseTypesQuery(restaurantId || "", 1000);

  const expenses = expensesResponse?.data ?? [];
  const expenseTypes = typesResponse?.data ?? [];

  const handleRefresh = async () => {
    dispatch({ type: "SET_IS_REFRESHING", payload: true });
    await refetchExpenses();
    dispatch({ type: "SET_IS_REFRESHING", payload: false });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const setFilterValues = (values: IExpenseFilterValues) => {
    dispatch({ type: "SET_FILTER_VALUES", payload: values });
  };

  const setSelectedExpense = (expense: IExpense | null) => {
    dispatch({ type: "SET_SELECTED_EXPENSE", payload: expense });
  };

  return {
    searchQuery: state.searchQuery,
    setSearchQuery,
    filterValues: state.filterValues,
    setFilterValues,
    selectedExpense: state.selectedExpense,
    setSelectedExpense,
    isRefreshing: state.isRefreshing,
    expenses,
    expenseTypes,
    currencySymbol,
    isLoading: isExpensesLoading || isTypesLoading,
    handleRefresh,
    defaultFilters: DEFAULT_EXPENSE_FILTERS,
  };
}
