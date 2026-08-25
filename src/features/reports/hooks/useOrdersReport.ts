// 1. React / React Native
import { useReducer } from "react";

// 4. Shared hooks
import { useAuth } from "@/hooks";

// 5. Feature hooks / services / state
import { useRestaurantQuery } from "@/features/restaurants";
import { ReportsService } from "../services/reportsService";
import {
  initialOrdersReportState,
  IOrderReportFilterValues,
  ordersReportReducer,
} from "../state/ordersReport.reducer";
import {
  useOrdersReportListQuery,
  useOrderSummaryQuery,
} from "./queries/useReportsQueries";

// 6. Types
import { type IOrder } from "../types";

// 7. Constants/utils
import { getCurrencySymbol, getDateRange } from "@/utils";

const initialRange = getDateRange("This Month");

export function useOrdersReport() {
  const { user } = useAuth();

  const restaurantId =
    user?.restaurant?.length > 0
      ? String(user?.restaurant[0]?.id)
      : String(user?.business_id || "1");

  // Query: Restaurant Settings
  const { data: restaurantResponse } = useRestaurantQuery({
    restaurant_id: restaurantId,
  });
  const settings = restaurantResponse?.restaurant;
  const currencySymbol = getCurrencySymbol(settings?.currency);

  // Reducer State
  const [state, dispatch] = useReducer(
    ordersReportReducer,
    initialOrdersReportState,
  );
  const { searchQuery, filterValues, page, selectedOrder } = state;

  const resolvedDateRange = {
    start_date: filterValues.date_range?.start || initialRange.start_date,
    end_date: filterValues.date_range?.end || initialRange.end_date,
  };

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

  // API Params for Paginated Orders List via ReportsService
  const ordersListParams = ReportsService.buildOrdersListParams(
    restaurantId,
    page,
    resolvedDateRange,
    searchQuery,
    filterValues,
  );

  // Query: Paginated Orders List
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

  const setSearchQuery = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const setFilterValues = (filters: IOrderReportFilterValues) => {
    dispatch({ type: "SET_FILTER_VALUES", payload: filters });
  };

  const setSelectedOrder = (order: IOrder | null) => {
    dispatch({ type: "SET_SELECTED_ORDER", payload: order });
  };

  return {
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
  };
}
