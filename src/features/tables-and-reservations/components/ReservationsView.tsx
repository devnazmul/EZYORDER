// 1. React / React Native
import { useState } from "react";
import { FlatList, View } from "react-native";

// 2. Navigation / Context & TanStack Query
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components
import { EmptyState } from "@/components/reuseable";

// 5. Feature components / hooks
import { useReservationsQuery } from "../hooks/queries/useReservationQueries";
import {
  DEFAULT_RESERVATION_FILTERS,
  ReservationCard,
  ReservationCardSkeleton,
  ReservationFilterPanel,
} from "./";

// 7. Constants/utils
import { RESERVATION_KEYS } from "@/constants/queryKeys";
import { HP } from "@/utils/getResponsiveSizes";

export default function ReservationsView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [filterValues, setFilterValues] = useState<Record<string, unknown>>(
    DEFAULT_RESERVATION_FILTERS,
  );
  const [refreshing, setRefreshing] = useState(false);

  const apiParams: Record<string, unknown> = {
    restaurant_id: restaurantId,
  };

  if (filterValues.status !== "all") {
    apiParams.status = filterValues.status;
  }

  if (
    typeof filterValues.date === "string" &&
    filterValues.date.trim() !== ""
  ) {
    apiParams.date = filterValues.date;
  }

  if (filterValues.sort_order) {
    apiParams.sort_order = filterValues.sort_order;
  }

  // Fetch reservations from server
  const {
    data: reservationsResponse,
    isLoading: isReservationsLoading,
    isFetching: isReservationsFetching,
  } = useReservationsQuery(apiParams);

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.all });
    setRefreshing(false);
  };

  const isListLoading = isReservationsLoading || isReservationsFetching;

  const renderEmptyOrLoadingState = () => {
    if (isListLoading) {
      return (
        <View className="gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ReservationCardSkeleton key={`skeleton-${i}`} />
          ))}
        </View>
      );
    }

    return (
      <EmptyState
        icon="event-busy"
        title="No Reservations Found"
        description={"There are no reservations booked yet."}
      />
    );
  };

  return (
    <FlatList
      data={isListLoading ? [] : (reservationsResponse?.data ?? [])}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-3"
      contentContainerStyle={{ paddingBottom: HP("10%") }}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      onRefresh={handleRefresh}
      ListHeaderComponent={
        <ReservationFilterPanel
          filterValues={filterValues}
          setFilterValues={setFilterValues}
        />
      }
      ListEmptyComponent={renderEmptyOrLoadingState}
      renderItem={({ item }) => <ReservationCard reservation={item} />}
    />
  );
}
