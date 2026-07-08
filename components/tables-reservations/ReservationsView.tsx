import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer from "@/components/reuseable/FilterDrawer";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { useReservationsQuery } from "@/hooks/useTableReservationQueries";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ReservationCard from "./ReservationCard";

const STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "booked", label: "Confirmed" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
  { id: "completed", label: "Completed" },
];

const ORDER_OPTIONS = [
  { id: "desc", label: "Newest First" },
  { id: "asc", label: "Oldest First" },
];

const DEFAULT_FILTERS = {
  status: "all",
  date: "",
  sort_order: "desc",
};

export default function ReservationsView() {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [filterValues, setFilterValues] = useState<Record<string, any>>(DEFAULT_FILTERS);

  // Construct API params for server-side filtering
  const apiParams = useMemo(() => {
    const params: Record<string, any> = {
      restaurant_id: restaurantId,
    };

    if (filterValues.status !== "all") {
      params.status = filterValues.status;
    }

    if (filterValues.date && filterValues.date.trim() !== "") {
      params.date = filterValues.date;
    }

    if (filterValues.sort_order) {
      params.sort_order = filterValues.sort_order;
    }

    return params;
  }, [filterValues, restaurantId]);

  // Fetch reservations from server
  const {
    data: reservationsResponse,
    isLoading: isReservationsLoading,
    refetch: refetchReservations,
  } = useReservationsQuery(token || "", apiParams);

  // Extract raw reservations list
  const reservations = useMemo(() => {
    if (!reservationsResponse) return [];
    if (Array.isArray(reservationsResponse)) return reservationsResponse;
    if (Array.isArray(reservationsResponse.data)) return reservationsResponse.data;
    if (reservationsResponse.data && Array.isArray(reservationsResponse.data.data))
      return reservationsResponse.data.data;
    return [];
  }, [reservationsResponse]);

  const filterFields = useMemo(() => {
    return [
      {
        id: "status",
        label: "Reservation Status",
        type: "chips" as const,
        options: STATUS_OPTIONS,
      },
      {
        id: "date",
        label: "Reservation Date",
        type: "date" as const,
      },
      {
        id: "sort_order",
        label: "Sort Order",
        type: "chips" as const,
        options: ORDER_OPTIONS,
      },
    ];
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterValues.status !== "all") count++;
    if (filterValues.date && filterValues.date.trim() !== "") count++;
    if (filterValues.sort_order !== "desc") count++;
    return count;
  }, [filterValues]);

  const handleRefresh = async () => {
    await refetchReservations();
  };

  const handleApplyFilters = (newValues: Record<string, any>) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
  };

  return (
    <RefreshableScrollView
      onRefresh={handleRefresh}
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Filter Trigger Row */}
      <View className="flex-row items-center gap-2 mb-4 px-1 ml-auto mr-0">
        <Text className="text-xs font-bold text-neutral">Filters:</Text>
        <FilterDrawer
          fields={filterFields}
          values={filterValues}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </View>

      {/* Reservations Section Title Header */}
      <View className="flex-row items-center justify-between mb-4 px-1">
        {activeFilterCount > 0 && (
          <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">
            Matching {reservations.length} Bookings
          </Text>
        )}
      </View>

      {/* Loading & List View */}
      {isReservationsLoading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#DC2D2A" />
          <Text className="mt-3 text-xs font-semibold text-accent">Loading reservations...</Text>
        </View>
      ) : reservations.length === 0 ? (
        <EmptyState
          icon="event-busy"
          title="No Reservations Found"
          description={
            activeFilterCount > 0
              ? "No reservations match your filter criteria."
              : "There are no reservations booked yet."
          }
        />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => <ReservationCard reservation={item} />}
        />
      )}
    </RefreshableScrollView>
  );
}
