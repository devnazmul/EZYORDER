// 1. React / React Native
import { useReducer } from "react";

// 3. External libraries / Shared hooks / Shared context
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/src/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

// 5. Feature components/hooks/services/state
import { useRestaurantQuery } from "@/features/restaurants/hooks/queries/useRestaurantQueries";
import { ExpenseService } from "../services/expense.service";
import {
  DEFAULT_EXPENSE_FILTERS,
  expensesReducer,
  type IExpensesState,
} from "../state/expenses.reducer";
import {
  useExpensePaymentMethodBreakdownQuery,
  useExpensesQuery,
  useExpenseTrendQuery,
  useExpenseTypesQuery,
} from "./queries/useExpenseQueries";

// 6. Types
import type { IExpenseFilterValues } from "../schema";
import type { IExpense } from "../types";

// 7. Constants/utils
import { EXPENSE_KEYS } from "@/constants/queryKeys";
import { getCurrencySymbol } from "@/utils";

const INITIAL_STATE: IExpensesState = {
  searchQuery: "",
  filterValues: DEFAULT_EXPENSE_FILTERS,
  selectedExpense: null,
  isRefreshing: false,
};

export function useExpenses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [state, dispatch] = useReducer(expensesReducer, INITIAL_STATE);
  const debouncedSearchQuery = useDebounce(state.searchQuery, 400);

  const { data: restaurantResponse } = useRestaurantQuery({
    restaurant_id: String(restaurantId || ""),
  });
  const currencySymbol = getCurrencySymbol(
    restaurantResponse?.restaurant?.currency,
  );

  const apiParams = ExpenseService.buildApiParams(
    debouncedSearchQuery,
    state.filterValues,
  );

  const { data: expensesResponse, isLoading: isExpensesLoading } =
    useExpensesQuery(restaurantId || "", 200, apiParams);

  const { data: typesResponse, isLoading: isTypesLoading } =
    useExpenseTypesQuery(restaurantId || "", 1000);

  const dateRangeParams = {
    ...(apiParams.start_date ? { start_date: apiParams.start_date } : {}),
    ...(apiParams.end_date ? { end_date: apiParams.end_date } : {}),
  };

  const {
    data: paymentBreakdownResponse,
    isLoading: isPaymentBreakdownLoading,
    isError: isPaymentBreakdownError,
    refetch: refetchPaymentBreakdown,
  } = useExpensePaymentMethodBreakdownQuery(dateRangeParams);

  const {
    data: expenseTrendResponse,
    isLoading: isExpenseTrendLoading,
    isError: isExpenseTrendError,
    refetch: refetchExpenseTrend,
  } = useExpenseTrendQuery(dateRangeParams);

  const expenses = expensesResponse?.data ?? [];
  const expenseTypes = typesResponse?.data ?? [];
  const paymentMethodBreakdownChartData = paymentBreakdownResponse?.data ?? [];
  const expenseTrendData = expenseTrendResponse?.data ?? [];

  const handleRefresh = async () => {
    dispatch({ type: "SET_IS_REFRESHING", payload: true });
    await queryClient.invalidateQueries({
      queryKey: EXPENSE_KEYS.all,
    });
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
    paymentMethodBreakdownChartData,
    isPaymentBreakdownLoading,
    isPaymentBreakdownError,
    refetchPaymentBreakdown,
    expenseTrendData,
    isExpenseTrendLoading,
    isExpenseTrendError,
    refetchExpenseTrend,
    currencySymbol,
    isLoading: isExpensesLoading || isTypesLoading,
    handleRefresh,
    defaultFilters: DEFAULT_EXPENSE_FILTERS,
  };
}
