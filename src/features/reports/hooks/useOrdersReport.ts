// 1. React / React Native
import { useMemo, useReducer } from "react";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared hooks
import { useAuth } from "@/hooks";

// 5. Feature hooks / services / state
import { useRestaurantQuery } from "@/features/restaurants";
import { OrderReportsService } from "../services/orderReportsService";
import {
  initialOrdersReportState,
  IOrderReportFilterValues,
  ordersReportReducer,
} from "../state/ordersReport.reducer";
import {
  useOrdersReportListInfiniteQuery,
  useOrderSummaryQuery,
} from "./queries/useReportsQueries";

// 6. Types
import { type IOrder } from "../types";

// 7. Constants/utils
import { REPORT_KEYS } from "@/constants";
import { getCurrencySymbol } from "@/utils";

export function useOrdersReport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
    start_date: filterValues.date_range?.start ?? "",
    end_date: filterValues.date_range?.end ?? "",
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
    isRefetching: isRefetchingSummary,
  } = useOrderSummaryQuery(summaryParams);

  // API Params for Paginated Orders List via OrderReportsService
  const ordersListParams = OrderReportsService.buildOrdersListParams(
    restaurantId,
    page,
    resolvedDateRange,
    searchQuery,
    filterValues,
  );

  // Query: Infinite Paginated Orders List
  const {
    data: ordersResponsePages,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    isRefetching: isRefetchingOrders,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrdersReportListInfiniteQuery(ordersListParams);

  const orders = useMemo(
    () => ordersResponsePages?.pages.flatMap((pg) => pg?.data ?? []) ?? [],
    [ordersResponsePages],
  );

  const lastPageMeta =
    ordersResponsePages?.pages[ordersResponsePages.pages.length - 1]?.meta;
  const totalOrdersCount = lastPageMeta?.total ?? orders.length;

  const isRefreshing =
    isRefetchingSummary || (isRefetchingOrders && !isFetchingNextPage);

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: REPORT_KEYS.orderSummaries(),
      }),
      queryClient.invalidateQueries({
        queryKey: REPORT_KEYS.ordersReports(),
      }),
    ]);
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
    isOrdersError,
    isRefreshing,
    handleRefresh,
    setSearchQuery,
    setFilterValues,
    setSelectedOrder,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
