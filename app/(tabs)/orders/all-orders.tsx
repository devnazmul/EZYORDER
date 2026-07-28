import OrderCard from "@/components/orders/OrderCard";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer, { FilterField } from "@/components/reuseable/FilterDrawer";
import SearchBar from "@/components/reuseable/SearchBar";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useAllOrdersQuery, useTodayOrdersQuery } from "@/hooks/useOrderQueries";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AllOrdersProps {
  initialTab?: "live" | "historical";
}

export default function AllOrders({ initialTab = "historical" }: AllOrdersProps) {
  const { token, user } = useAuth();
  const searchParams = useLocalSearchParams();
  const pathname = usePathname();

  const restaurantId =
    user?.restaurant?.length > 0 ? String(user?.restaurant[0]?.id) : String(user?.business_id || "1");

  // Tab State: "live" (Today's) vs "historical" (All)
  const [activeTab, setActiveTab] = useState<"live" | "historical">(initialTab);

  // Search Input State
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Drawer Filters
  const [filterValues, setFilterValues] = useState<any>({
    status: ["all"],
    payment_status: "all",
    order_type: ["all"],
    customer_name: "",
    customer_phone: "",
    table_number: "",
    date_range: { start: "", end: "" },
    amount_range: { min: "", max: "" },
  });

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setActiveTab(initialTab);
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
        setActiveTab("live");
      } else {
        setActiveTab("historical");
      }

      setFilterValues({
        status: searchParams.status
          ? [searchParams.status as string]
          : (searchParams.exclude_status ? ["pending", "kitchen"] : ["all"]),
        payment_status: searchParams.payment_status ? (searchParams.payment_status as string) : "all",
        order_type: searchParams.tab ? (searchParams.tab as string).split(",") : ["all"],
        customer_name: "",
        customer_phone: "",
        table_number: "",
        date_range: { start: "", end: "" },
        amount_range: { min: "", max: "" },
        exclude_status: searchParams.exclude_status || "",
        date_filter: (searchParams.date_filter as string) || (searchParams.filterBy as string) || "",
        is_schedule_order: searchParams.is_schedule_order || "",
        dish_ids: searchParams.dish_ids || "",
        dish_name: searchParams.dish_name || "",
        is_delay: searchParams.is_delay || "",
      });

      // Clear the query parameters from the router state so they don't trigger again
      router.setParams({
        exclude_status: undefined as any,
        date_filter: undefined as any,
        tab: undefined as any,
        filterBy: undefined as any,
        is_schedule_order: undefined as any,
        status: undefined as any,
        payment_status: undefined as any,
        dish_ids: undefined as any,
        dish_name: undefined as any,
        is_delay: undefined as any,
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

  // Define dynamic filter fields for the FilterDrawer
  const filterFields: FilterField[] = useMemo(() => {
    const fields: FilterField[] = [
      {
        id: "status",
        label: "Order Status",
        type: "chips",
        isMultiSelect: true,
        options: [
          { id: "all", label: "All" },
          { id: "pending", label: "Pending" },
          { id: "kitchen", label: "Kitchen" },
          { id: "completed", label: "Completed" },
        ],
      },
      {
        id: "payment_status",
        label: "Payment Status",
        type: "chips",
        isMultiSelect: false,
        options: [
          { id: "all", label: "All" },
          { id: "paid", label: "Paid" },
          { id: "unpaid", label: "Unpaid" },
        ],
      },
      {
        id: "order_type",
        label: "Order Type",
        type: "chips",
        isMultiSelect: true,
        options: [
          { id: "all", label: "All" },
          { id: "eat_in", label: "Eat In" },
          { id: "delivery", label: "Delivery" },
          { id: "take_away", label: "Take Away" },
          { id: "walk_in", label: "Walk In" },
        ],
      },
      {
        id: "customer_name",
        label: "Customer Name",
        type: "text",
        keyboardType: "default",
      },
      {
        id: "customer_phone",
        label: "Customer Phone",
        type: "text",
        keyboardType: "phone-pad",
      },
      {
        id: "table_number",
        label: "Table Number",
        type: "text",
        keyboardType: "default",
      },
      { id: "date_range", label: "Date Range", type: "date-range" },
      { id: "amount_range", label: "Price Range", type: "number-range" },
    ];

    return fields;
  }, []);

  // Map filters to API parameters
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (filterValues.exclude_status) {
      params.exclude_status = filterValues.exclude_status;
    }
    if (filterValues.date_filter) {
      params.date_filter = filterValues.date_filter;
    }
    if (filterValues.is_schedule_order) {
      params.is_schedule_order = filterValues.is_schedule_order;
    }
    if (filterValues.dish_ids) {
      params.dish_ids = filterValues.dish_ids;
    }
    if (filterValues.dish_name) {
      params.dish_name = filterValues.dish_name;
    }
    if (filterValues.is_delay) {
      params.is_delay = filterValues.is_delay;
    }

    if (debouncedSearchQuery.trim()) {
      params.order_id = debouncedSearchQuery.trim();
    }

    if (filterValues.status && Array.isArray(filterValues.status)) {
      const activeStatuses = filterValues.status.filter((s: string) => s !== "all");
      if (activeStatuses.length > 0) {
        params.status = activeStatuses;
      }
    }

    if (filterValues.payment_status && filterValues.payment_status !== "all") {
      params.payment_status = [filterValues.payment_status];
    }

    if (filterValues.order_type && Array.isArray(filterValues.order_type)) {
      const activeTypes = filterValues.order_type.filter((t: string) => t !== "all");
      if (activeTypes.length > 0) {
        params.order_type = activeTypes;
      }
    }

    if (filterValues.customer_name?.trim()) {
      params.customer_name = filterValues.customer_name.trim();
    }

    if (filterValues.customer_phone?.trim()) {
      params.customer_phone = filterValues.customer_phone.trim();
    }

    if (filterValues.table_number?.trim()) {
      params.table_number = filterValues.table_number.trim();
    }

    if (filterValues.date_range?.start) {
      params.from_date = filterValues.date_range.start;
    }
    if (filterValues.date_range?.end) {
      params.to_date = filterValues.date_range.end;
    }

    if (filterValues.amount_range?.min) {
      params.min_amount = filterValues.amount_range.min;
    }
    if (filterValues.amount_range?.max) {
      params.max_amount = filterValues.amount_range.max;
    }

    return params;
  }, [debouncedSearchQuery, filterValues]);

  // Call query hooks unconditionally at the top level
  const todayQuery = useTodayOrdersQuery(token || "", restaurantId, queryParams, { enabled: isLive });
  const allQuery = useAllOrdersQuery(token || "", restaurantId, queryParams, { enabled: !isLive });

  const { data: orders = [], isLoading, isRefetching, refetch } = isLive ? todayQuery : allQuery;

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      {/* Main Body */}
      <View className="flex-1 px-4 py-4">
        {/* Toggle between Live and Historical */}
        <ToggleBar
          options={[
            { id: "live", label: "Today's Orders" },
            { id: "historical", label: "All Orders" },
          ]}
          activeId={activeTab}
          onSelect={(id) => {
            setActiveTab(id as "live" | "historical");
            setFilterValues({
              status: ["all"],
              payment_status: "all",
              order_type: ["all"],
              customer_name: "",
              customer_phone: "",
              table_number: "",
              date_range: { start: "", end: "" },
              amount_range: { min: "", max: "" },
            });
            setSearchQuery("");
          }}
          containerClassName="mb-4"
        />

        {/* Filters Panel Container */}
        <View className="gap-y-3 mb-4">
          {/* Search Bar & Custom Filter Drawer */}
          <View className="flex-row items-center gap-3">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by Order ID..."
              keyboardType="numeric"
              containerClassName="flex-1 rounded-xl py-2"
            />
            <FilterDrawer
              fields={filterFields}
              values={filterValues}
              onApply={(values) => setFilterValues(values)}
              onClear={() =>
                setFilterValues({
                  status: ["all"],
                  payment_status: "all",
                  order_type: ["all"],
                  customer_name: "",
                  customer_phone: "",
                  table_number: "",
                  date_range: { start: "", end: "" },
                  amount_range: { min: "", max: "" },
                })
              }
            />
          </View>
        </View>

        {/* List Content */}
        {isLoading ? (
          <View key="loading" className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#DC2D2A" />
            <Text className="text-xs text-accent mt-3">Loading orders...</Text>
          </View>
        ) : (
          <FlatList
            key="loaded"
            data={isRefetching ? [] : orders}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <OrderCard item={item} onViewDetails={() => handleViewDetails(item)} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#DC2D2A"]} />
            }
            ListEmptyComponent={
              isRefetching ? (
                <View className="py-20 items-center justify-center">
                  <ActivityIndicator size="large" color="#DC2D2A" />
                  <Text className="text-xs text-accent mt-3">Loading orders data...</Text>
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
        onClose={() => setShowDetailsModal(false)}
      />
    </SafeAreaView>
  );
}
