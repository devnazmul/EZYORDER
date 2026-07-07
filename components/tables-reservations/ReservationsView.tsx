import KpiCard from "@/components/reports/KpiCard";
import EmptyState from "@/components/reuseable/EmptyState";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ReservationCard from "./ReservationCard";

interface ReservationsViewProps {
  reservations: any[];
  isLoading: boolean;
}

export default function ReservationsView({ reservations, isLoading }: ReservationsViewProps) {
  // Compute stats from reservations data
  const stats = useMemo(() => {
    const data = Array.isArray(reservations) ? reservations : [];
    return {
      total: data.length,
      pending: data.filter((r) => r.status?.toLowerCase() === "pending").length,
      confirmed: data.filter(
        (r) => r.status?.toLowerCase() === "accepted" || r.status?.toLowerCase() === "approved",
      ).length,
      declined: data.filter(
        (r) => r.status?.toLowerCase() === "declined" || r.status?.toLowerCase() === "rejected",
      ).length,
    };
  }, [reservations]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="mt-3 text-xs font-semibold text-accent">Loading reservations...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* KPI Stats Grid */}
      <View className="mb-6">
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-3">
          Reservation Stats
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <View className="flex-1 min-w-[45%]">
            <KpiCard
              title="Total Today"
              value={String(stats.total)}
              iconName="calendar-today"
              variant="dark"
              gradientColors={["#b80a14", "#8a0710"]}
            />
          </View>
          <View className="flex-1 min-w-[45%]">
            <KpiCard
              title="Pending"
              value={String(stats.pending)}
              iconName="schedule"
              variant="dark"
              gradientColors={["#162032", "#0a1220"]}
            />
          </View>
          <View className="flex-1 min-w-[45%]">
            <KpiCard
              title="Confirmed"
              value={String(stats.confirmed)}
              iconName="check-circle"
              variant="dark"
              gradientColors={["#0d2b24", "#061510"]}
            />
          </View>
          <View className="flex-1 min-w-[45%]">
            <KpiCard
              title="Declined"
              value={String(stats.declined)}
              iconName="cancel"
              variant="dark"
              gradientColors={["#3a0d12", "#1a0608"]}
            />
          </View>
        </View>
      </View>

      {/* Reservations List */}
      <View className="flex-row items-center justify-between mb-4 px-1">
        <Text className="text-base font-black text-neutral">Upcoming Bookings</Text>
      </View>

      {reservations.length === 0 ? (
        <EmptyState
          icon="event-busy"
          title="No Reservations"
          description="There are no reservations for the selected date."
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
    </View>
  );
}
