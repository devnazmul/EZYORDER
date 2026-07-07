import KpiCard from "@/components/reports/KpiCard";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer from "@/components/reuseable/FilterDrawer";
import SearchBar from "@/components/reuseable/SearchBar";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import ReservationCard from "./ReservationCard";

interface ReservationsViewProps {
  reservations: any[];
  isLoading: boolean;
}

const DEFAULT_FILTERS = {
  status: "all",
  area: "all",
  dateRange: { start: "", end: "" },
};

export default function ReservationsView({ reservations, isLoading }: ReservationsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>(DEFAULT_FILTERS);

  // Compute active filter count dynamically
  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(filterValues).forEach((key) => {
      const val = filterValues[key];
      if (val === "all") return;
      if (typeof val === "object" && val !== null) {
        if (val.start || val.end) count++;
      } else if (val) {
        count++;
      }
    });
    return count;
  }, [filterValues]);

  // Compute stats from raw reservations data
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

  // Dynamically extract unique areas from reservations
  const areaChips = useMemo(() => {
    const areas = new Set<string>();
    reservations.forEach((r) => {
      if (r.table?.area) {
        const areaStr = r.table.area.trim();
        if (areaStr) {
          areas.add(areaStr.charAt(0).toUpperCase() + areaStr.slice(1).toLowerCase());
        }
      }
    });

    const list = Array.from(areas).map((area) => ({
      id: area.toLowerCase(),
      label: area,
    }));

    return [{ id: "all", label: "All Areas" }, ...list];
  }, [reservations]);

  // Define filter fields for generic FilterDrawer
  const filterFields = useMemo(
    () => [
      {
        id: "status",
        label: "Reservation Status",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Statuses" },
          { id: "pending", label: "Pending" },
          { id: "accepted", label: "Confirmed" },
          { id: "declined", label: "Declined" },
          { id: "seated", label: "Seated" },
          { id: "cancelled", label: "Cancelled" },
        ],
      },
      {
        id: "area",
        label: "Table Area",
        type: "chips" as const,
        options: areaChips,
      },
      {
        id: "dateRange",
        label: "Date Range",
        type: "date-range" as const,
      },
    ],
    [areaChips],
  );



  // Filter reservations locally
  const filteredReservations = useMemo(() => {
    let result = reservations;

    // 1. Search Query (name, phone, email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          (r.customer_name || "").toLowerCase().includes(q) ||
          (r.phone || "").toLowerCase().includes(q) ||
          (r.email || "").toLowerCase().includes(q),
      );
    }

    // 2. Status Filter
    if (filterValues.status !== "all") {
      result = result.filter((r) => {
        const s = (r.status || "").toLowerCase();
        if (filterValues.status === "accepted") {
          return s === "accepted" || s === "approved";
        }
        if (filterValues.status === "declined") {
          return s === "declined" || s === "rejected";
        }
        return s === filterValues.status;
      });
    }

    // 3. Area Filter
    if (filterValues.area !== "all") {
      result = result.filter((r) => (r.table?.area || "").toLowerCase() === filterValues.area);
    }

    // 4. Date Range Filter
    const { start, end } = filterValues.dateRange;
    if (start || end) {
      result = result.filter((r) => {
        if (!r.reservation_date) return false;

        const parseDate = (dStr: string) => {
          const parts = dStr.split("-");
          if (parts.length === 3) {
            // Check if format is DD-MM-YYYY (parts[2] has 4 digits) or YYYY-MM-DD
            if (parts[2].length === 4) {
              return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
            } else {
              return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            }
          }
          return new Date(dStr);
        };

        try {
          const resDate = parseDate(r.reservation_date);

          if (start) {
            const startDate = parseDate(start);
            if (resDate < startDate) return false;
          }
          if (end) {
            const endDate = parseDate(end);
            if (resDate > endDate) return false;
          }
          return true;
        } catch {
          return false;
        }
      });
    }

    return result;
  }, [reservations, searchQuery, filterValues]);

  const handleApplyFilters = (newValues: Record<string, any>) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
  };

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

      {/* Standalone Search Bar & Filter Toggle Row */}
      <View className="flex-row items-center gap-3 mb-6">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search customer name, phone..."
          containerClassName="flex-1"
        />
        <FilterDrawer
          fields={filterFields}
          values={filterValues}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </View>

      {/* Reservations List Section */}
      <View className="flex-row items-center justify-between mb-4 px-1">
        <Text className="text-base font-black text-neutral">Upcoming Bookings</Text>
      </View>

      {filteredReservations.length === 0 ? (
        <EmptyState
          icon="event-busy"
          title="No Reservations Found"
          description={
            searchQuery || activeFilterCount > 0
              ? "No reservations match your filter criteria."
              : "There are no reservations for the selected date."
          }
        />
      ) : (
        <FlatList
          data={filteredReservations}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => <ReservationCard reservation={item} />}
        />
      )}

    </View>
  );
}
