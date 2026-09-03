import AppHeader from "@/components/AppHeader";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer, { IFilterField } from "@/components/reuseable/FilterDrawer";
import PageTitle from "@/components/reuseable/PageTitle";
import SearchBar from "@/components/reuseable/SearchBar";
import { useAuth } from "@/src/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import React, { useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DriverOrderFeedCard from "../components/DriverOrderFeedCard";
import OrderDetailsDrawer from "../components/OrderDetailsDrawer";
import DriverOrderFeedCardSkeleton from "../components/skeletons/DriverOrderFeedCardSkeleton";
import {
  useDriverDashboardStatsQuery,
  useDriverOrdersListQuery,
} from "../hooks/queries/useDriverQueries";
import { DriverOrder } from "../types";

export default function DriverMyOrdersScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Filter Values State
  const [filterValues, setFilterValues] = useState<any>({
    status: ["all"],
    payment_status: "all",
    customer_name: "",
    customer_phone: "",
    date_range: { start: "", end: "" },
    amount_range: { min: "", max: "" },
  });

  // Selected Order for Details Sheet
  const [selectedOrder, setSelectedOrder] = useState<DriverOrder | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // Fetch Stats (for Currency Symbol)
  const { data: statsData } = useDriverDashboardStatsQuery();
  const currencySymbol = useMemo(() => {
    if (statsData?.currency_symbol) {
      return getCurrencySymbol(statsData.currency_symbol);
    }
    return "£";
  }, [statsData]);

  // Define dynamic filter fields for the FilterDrawer
  const filterFields: IFilterField[] = useMemo(() => {
    return [
      {
        id: "status",
        label: "Order Status",
        type: "chips",
        isMultiSelect: true,
        options: [
          { id: "all", label: "All" },
          { id: "accepted", label: "Accepted" },
          { id: "picked_up", label: "Picked Up" },
          { id: "on_route", label: "En Route" },
          { id: "arrived", label: "Arrived" },
          { id: "delivered", label: "Delivered" },
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
      { id: "date_range", label: "Date Range", type: "date-range" },
      { id: "amount_range", label: "Price Range", type: "number-range" },
    ];
  }, []);

  // Map filters to API parameters
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      driver_id: user?.id,
      per_page: 50,
      page: 1,
    };

    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }

    if (filterValues.status && Array.isArray(filterValues.status)) {
      const activeStatuses = filterValues.status.filter(
        (s: string) => s !== "all",
      );
      if (activeStatuses.length > 0) {
        params.status = activeStatuses;
      }
    }

    if (filterValues.payment_status && filterValues.payment_status !== "all") {
      params.payment_status = [filterValues.payment_status];
    }

    if (filterValues.customer_name?.trim()) {
      params.customer_name = filterValues.customer_name.trim();
    }

    if (filterValues.customer_phone?.trim()) {
      params.customer_phone = filterValues.customer_phone.trim();
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
  }, [debouncedSearchQuery, filterValues, user?.id]);

  // Fetch driver orders list
  const {
    data: rawOrdersData,
    isLoading,
    isRefetching,
    refetch,
  } = useDriverOrdersListQuery(queryParams);

  // Safe Extraction of Orders List
  const orders: DriverOrder[] = useMemo(() => {
    if (!rawOrdersData) return [];
    const rawList =
      rawOrdersData.data?.data || rawOrdersData.data || rawOrdersData;
    return Array.isArray(rawList) ? rawList : [];
  }, [rawOrdersData]);

  const handleOpenDetails = (order: DriverOrder) => {
    setSelectedOrder(order);
    setIsDetailsVisible(true);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader />

      <View className="flex-1 px-4 py-4">
        {/* Header Title */}
        <PageTitle
          title="My Orders"
          icon="receipt"
          description="Manage and track your assigned delivery transactions."
        />

        {/* Search and Filters Bar */}
        <View className="flex-row items-center gap-3 mt-4 mb-4">
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
                customer_name: "",
                customer_phone: "",
                date_range: { start: "", end: "" },
                amount_range: { min: "", max: "" },
              })
            }
          />
        </View>

        {/* List Content */}
        {isLoading ? (
          <View key="loading" className="flex-1">
            {[1, 2, 3].map((key) => (
              <DriverOrderFeedCardSkeleton key={key} />
            ))}
          </View>
        ) : isRefetching ? (
          <View key="loading" className="flex-1">
            {[1, 2, 3].map((key) => (
              <DriverOrderFeedCardSkeleton key={key} />
            ))}
          </View>
        ) : (
          <FlatList
            key="loaded"
            data={isRefetching ? [] : orders}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <DriverOrderFeedCard
                order={item}
                currencySymbol={currencySymbol}
                onViewDetails={() => handleOpenDetails(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={["#DC2D2A"]}
              />
            }
            ListEmptyComponent={
              <View key="empty" className="mt-8">
                <EmptyState
                  icon="assignment-late"
                  title="No Orders Found"
                  description="Try modifying your filters or checking back later."
                  pyClassName="py-20"
                />
              </View>
            }
          />
        )}
      </View>

      {/* Details Slide-Up Sheet */}
      <OrderDetailsDrawer
        order={selectedOrder}
        visible={isDetailsVisible}
        onClose={() => {
          setIsDetailsVisible(false);
          setSelectedOrder(null);
        }}
        currencySymbol={currencySymbol}
      />
    </SafeAreaView>
  );
}
