import EmptyState from "@/components/reuseable/EmptyState";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { OrderFilterPanel } from "../components/OrderFilterPanel";
import { IOrderFilterValues } from "../types/orderFilter.types";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { WP } from "@/utils/getResponsiveSizes";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useMemo, useReducer, useCallback } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCard from "../components/OrderCard";
import OrderDetailsModal from "../components/OrderDetailsModal";
import OrderCardSkeleton from "../components/skeletons/OrderCardSkeleton";
import {
  useAllOrdersQuery,
  useTodayOrdersQuery,
} from "../hooks/queries/useOrderQueries";
import { OrderService } from "../services/orderService";
import { IOrder } from "@/src/features/reports/types/order.types";
import {
  allOrdersReducer,
  defaultFilterValues,
} from "../state/allOrders.reducer";

// ==================== TYPES ====================
interface IAllOrdersProps {
  readonly initialTab?: "live" | "historical";
}

// ==================== COMPONENT ====================

export default function AllOrders({
  initialTab = "historical",
}: IAllOrdersProps) {
  const { user } = useAuth();
  const searchParams = useLocalSearchParams();
  const pathname = usePathname();

  const restaurantId =
    user?.restaurant?.length > 0
      ? String(user?.restaurant[0]?.id)
      : String(user?.business_id || "1");

  // ==================== HOOKS ====================
  const [state, dispatch] = useReducer(allOrdersReducer, {
    activeTab: initialTab,
    searchQuery: "",
    filterValues: defaultFilterValues,
    selectedOrder: null,
    showDetailsModal: false,
  });

  const {
    activeTab,
    searchQuery,
    filterValues,
    selectedOrder,
    showDetailsModal,
  } = state;

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  const setFilterValues = useCallback((values: IOrderFilterValues) => {
    dispatch({ type: "SET_FILTER_VALUES", payload: values });
  }, []);

  // Sync prop changes
  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: initialTab });
  }, [initialTab]);

  // Sync router search params
  useEffect(() => {
    if (
      searchParams.exclude_status ||
      searchParams.date_filter ||
      searchParams.filterBy ||
      searchParams.tab ||
      searchParams.is_schedule_order ||
      searchParams.status ||
      searchParams.payment_status ||
      searchParams.dish_ids ||
      searchParams.dish_name ||
      searchParams.is_delay
    ) {
      if (pathname.includes("todays-orders")) {
        dispatch({ type: "SET_ACTIVE_TAB", payload: "live" });
      } else {
        dispatch({ type: "SET_ACTIVE_TAB", payload: "historical" });
      }

      dispatch({
        type: "SET_FILTER_VALUES",
        payload: {
          status: searchParams.status
            ? [searchParams.status as string]
            : searchParams.exclude_status
              ? ["pending", "kitchen"]
              : ["all"],
          payment_status: searchParams.payment_status
            ? (searchParams.payment_status as string)
            : "all",
          order_type: searchParams.tab
            ? (searchParams.tab as string).split(",")
            : ["all"],
          customer_name: "",
          customer_phone: "",
          table_number: "",
          date_range: { start: "", end: "" },
          amount_range: { min: "", max: "" },
          exclude_status: searchParams.exclude_status || "",
          date_filter:
            (searchParams.date_filter as string) ||
            (searchParams.filterBy as string) ||
            "",
          is_schedule_order: searchParams.is_schedule_order || "",
          dish_ids: searchParams.dish_ids || "",
          dish_name: searchParams.dish_name || "",
          is_delay: searchParams.is_delay || "",
        } as IOrderFilterValues,
      });

      // Clear the query parameters from the router state so they don't trigger again
      router.setParams({
        exclude_status: undefined as unknown as string,
        date_filter: undefined as unknown as string,
        tab: undefined as unknown as string,
        filterBy: undefined as unknown as string,
        is_schedule_order: undefined as unknown as string,
        status: undefined as unknown as string,
        payment_status: undefined as unknown as string,
        dish_ids: undefined as unknown as string,
        dish_name: undefined as unknown as string,
        is_delay: undefined as unknown as string,
      });
    }
  }, [
    searchParams.exclude_status,
    searchParams.date_filter,
    searchParams.filterBy,
    searchParams.tab,
    searchParams.is_schedule_order,
    searchParams.status,
    searchParams.payment_status,
    searchParams.dish_ids,
    searchParams.dish_name,
    searchParams.is_delay,
    pathname,
  ]);

  const isLive = activeTab === "live";

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // The filter fields are now contained inside OrderFilterPanel

  // Map filters to API parameters
  const queryParams = useMemo(() => {
    return OrderService.buildAllOrdersQueryParams(
      debouncedSearchQuery,
      filterValues,
    );
  }, [debouncedSearchQuery, filterValues]);

  // Call query hooks unconditionally at the top level
  const todayQuery = useTodayOrdersQuery(restaurantId, queryParams, {
    enabled: isLive,
  });
  const allQuery = useAllOrdersQuery(restaurantId, queryParams, {
    enabled: !isLive,
  });

  const {
    data: orders = [],
    isLoading,
    isRefetching,
    refetch,
  } = isLive ? todayQuery : allQuery;

  // ==================== HANDLERS ====================
  const handleViewDetails = useCallback((order: IOrder) => {
    dispatch({ type: "SET_SELECTED_ORDER", payload: order });
    dispatch({ type: "SET_SHOW_DETAILS_MODAL", payload: true });
  }, []);

  // ==================== RENDER ====================

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      {/* Main Body */}
      <View style={{ paddingHorizontal: WP("4%") }} className="flex-1 py-4">
        {/* Toggle between Live and Historical */}
        <ToggleBar
          options={[
            { id: "live", label: "Today's Orders" },
            { id: "historical", label: "All Orders" },
          ]}
          activeId={activeTab}
          onSelect={(id) => {
            dispatch({
              type: "SET_ACTIVE_TAB",
              payload: id as "live" | "historical",
            });
            dispatch({
              type: "SET_FILTER_VALUES",
              payload: defaultFilterValues,
            });
            dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
          }}
          containerClassName="mb-4"
        />

        <OrderFilterPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
        />

        {/* List Content */}
        {isLoading ? (
          <View key="loading" className="flex-1">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </View>
        ) : (
          <FlatList
            key="loaded"
            data={isRefetching ? [] : orders}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <OrderCard
                item={item}
                onViewDetails={() => handleViewDetails(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={[COLORS.primary]}
              />
            }
            ListEmptyComponent={
              isRefetching ? (
                <View key="refetching" className="flex-1">
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                </View>
              ) : (
                <View key="empty" className="mt-8">
                  <EmptyState
                    icon="assignment-late"
                    title="No Orders Found"
                    description="Try modifying your filters or checking back later."
                    pyClassName="py-20"
                  />
                </View>
              )
            }
          />
        )}
      </View>

      {/* Order Details Modal (View Details) */}
      <OrderDetailsModal
        visible={showDetailsModal}
        order={selectedOrder}
        onClose={() =>
          dispatch({ type: "SET_SHOW_DETAILS_MODAL", payload: false })
        }
      />
    </SafeAreaView>
  );
}
