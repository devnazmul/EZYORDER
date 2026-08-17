import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer from "@/components/reuseable/FilterDrawer";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { useReservationsQuery } from "@/features/owner/more/hooks/queries/useTableReservationQueries";
import { getResponsiveFontSize, HP } from "@/utils/getResponsiveSizes";
import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import ReservationCard from "./ReservationCard";
import ReservationCardSkeleton from "./ReservationCardSkeleton";

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

interface ReservationsViewProps {
  header?: React.ReactNode;
}

export default function ReservationsView({ header }: ReservationsViewProps) {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [filterValues, setFilterValues] =
    useState<Record<string, any>>(DEFAULT_FILTERS);

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
    isFetching: isReservationsFetching,
    refetch: refetchReservations,
  } = useReservationsQuery(token || "", apiParams);

  // Extract raw reservations list
  const reservations = useMemo(() => {
    if (!reservationsResponse) return [];
    if (Array.isArray(reservationsResponse)) return reservationsResponse;
    if (Array.isArray(reservationsResponse.data))
      return reservationsResponse.data;
    if (
      reservationsResponse.data &&
      Array.isArray(reservationsResponse.data.data)
    )
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
      contentContainerStyle={{ paddingBottom: HP("2%") }}
    >
      {header}
      {/* Filter Trigger Row */}
      <View className="mb-1 -mt-3 flex-row items-center gap-3 ml-auto mr-0">
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="font-bold text-neutral"
        >
          Filters:
        </Text>
        <FilterDrawer
          fields={filterFields}
          values={filterValues}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </View>

      {/* Reservations Section Title Header */}
      <View className="flex-row items-center justify-between mb-2 px-1">
        {activeFilterCount > 0 && (
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-bold text-accent capitalize tracking-wider"
          >
            Matching {reservations.length} Bookings
          </Text>
        )}
      </View>

      {/* Loading & List View */}
      {isReservationsLoading || isReservationsFetching ? (
        <View key="loading" className="flex-1">
          <FlatList
            data={Array.from({ length: 4 }, (_, i) => ({
              id: `skeleton-${i}`,
            }))}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerClassName="gap-2"
            renderItem={() => <ReservationCardSkeleton />}
          />
        </View>
      ) : reservations.length === 0 ? (
        <View key="empty" className="flex-1">
          <EmptyState
            icon="event-busy"
            title="No Reservations Found"
            description={
              activeFilterCount > 0
                ? "No reservations match your filter criteria."
                : "There are no reservations booked yet."
            }
          />
        </View>
      ) : (
        <View key="loaded" className="flex-1">
          <FlatList
            data={reservations}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            contentContainerClassName="gap-2"
            renderItem={({ item }) => <ReservationCard reservation={item} />}
          />
        </View>
      )}
    </RefreshableScrollView>
  );
}
