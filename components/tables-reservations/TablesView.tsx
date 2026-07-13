import KpiCard from "@/components/reports/KpiCard";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer from "@/components/reuseable/FilterDrawer";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import SearchBar from "@/components/reuseable/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useAllTablesQuery, useTableMatrixQuery } from "@/hooks/useTableReservationQueries";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import TableCard from "./TableCard";

const STATUS_CHIPS = [
  { id: "all", label: "All Statuses" },
  { id: "free", label: "Available" },
  { id: "occupied", label: "Occupied" },
  { id: "reserved", label: "Reserved" },
];

const AREA_CHIPS = [
  { id: "all", label: "All Areas" },
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "rooftop", label: "Rooftop" },
];

const ACTIVE_CHIPS = [
  { id: "all", label: "All Status" },
  { id: "active", label: "Active Only" },
  { id: "inactive", label: "Inactive Only" },
];

const DEFAULT_FILTERS = {
  area: "all",
  status: "all",
  is_active: "all",
  capacity: "",
};

export default function TablesView() {
  const { token } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [filterValues, setFilterValues] = useState<Record<string, any>>(DEFAULT_FILTERS);

  // Construct API params for server-side filtering
  const apiParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (debouncedSearchQuery.trim() !== "") {
      params.search_key = debouncedSearchQuery.trim();
    }

    if (filterValues.area !== "all") {
      params.area = filterValues.area;
    }

    if (filterValues.status !== "all") {
      params.status = filterValues.status;
    }

    if (filterValues.is_active !== "all") {
      params.is_active = filterValues.is_active === "active";
    }

    if (filterValues.capacity && filterValues.capacity.trim() !== "") {
      const capNum = parseInt(filterValues.capacity, 10);
      if (!isNaN(capNum)) {
        params.capacity = capNum;
      }
    }

    return params;
  }, [debouncedSearchQuery, filterValues]);

  // Fetch tables with server-side query params
  const {
    data: tablesData,
    isLoading: isTablesLoading,
    refetch: refetchTables,
  } = useAllTablesQuery(token || "", apiParams);

  // Fetch tables KPI matrix
  const {
    data: matrixData,
    isLoading: isMatrixLoading,
    refetch: refetchMatrix,
  } = useTableMatrixQuery(token || "");

  // Extract tables array safely
  const tables = useMemo(() => {
    if (Array.isArray(tablesData)) return tablesData;
    if (tablesData?.data && Array.isArray(tablesData.data)) return tablesData.data;
    return [];
  }, [tablesData]);

  // Extract matrix safely
  const matrix = useMemo(() => {
    if (matrixData?.data) return matrixData.data;
    return matrixData || null;
  }, [matrixData]);

  const filterFields = useMemo(() => {
    return [
      {
        id: "area",
        label: "Areas",
        type: "chips" as const,
        options: AREA_CHIPS,
      },
      {
        id: "status",
        label: "Statuses",
        type: "chips" as const,
        options: STATUS_CHIPS,
      },
      {
        id: "is_active",
        label: "Active Status",
        type: "chips" as const,
        options: ACTIVE_CHIPS,
      },
      {
        id: "capacity",
        label: "Capacity Limit",
        type: "text" as const,
      },
    ];
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterValues.area !== "all") count++;
    if (filterValues.status !== "all") count++;
    if (filterValues.is_active !== "all") count++;
    if (filterValues.capacity && filterValues.capacity.trim() !== "") count++;
    return count;
  }, [filterValues]);

  const handleRefresh = async () => {
    await Promise.all([refetchTables(), refetchMatrix()]);
  };

  const handleApplyFilters = (newValues: Record<string, any>) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
  };

  const isLoading = isTablesLoading || isMatrixLoading;

  return (
    <RefreshableScrollView
      onRefresh={handleRefresh}
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* KPI Stats Grid */}
      {matrix && (
        <View className="mb-6">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-3">
            Table Overview
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Total Tables"
                value={String(matrix.total ?? 0)}
                iconName="table-restaurant"
                variant="dark"
                gradientColors={["#2d3e56", "#1b283c"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Occupied"
                value={String(matrix.occupied ?? 0)}
                iconName="no-meals"
                variant="dark"
                gradientColors={["#1e4f43", "#11322b"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Reserved"
                value={String(matrix.reserved ?? 0)}
                iconName="event-seat"
                variant="dark"
                gradientColors={["#4c3590", "#2e1e5c"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Available"
                value={String(matrix.free ?? 0)}
                iconName="check-circle"
                variant="dark"
                gradientColors={["#6d242b", "#3d1115"]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Search & Filter Header Row */}
      <View className="flex-row items-center gap-3 mb-4">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tables..."
          containerClassName="flex-1"
        />
        <FilterDrawer
          fields={filterFields}
          values={filterValues}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </View>

      {/* Active Filter count label */}
      {(searchQuery.trim() !== "" || activeFilterCount > 0) && (
        <View className="flex-row items-center justify-between mb-4 px-1">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">
            Matching {tables.length} Tables
          </Text>
        </View>
      )}

      {/* Table Cards Grid */}
      {isTablesLoading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#DC2D2A" />
          <Text className="mt-3 text-xs font-semibold text-accent">Loading tables...</Text>
        </View>
      ) : tables.length === 0 ? (
        <EmptyState
          icon="table-restaurant"
          title="No Tables Found"
          description={
            searchQuery || activeFilterCount > 0
              ? "No tables found matching the selected filter criteria."
              : "No restaurant tables have been configured yet."
          }
        />
      ) : (
        <FlatList
          data={tables}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12 }}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className="flex-1">
              <TableCard table={item} />
            </View>
          )}
        />
      )}
    </RefreshableScrollView>
  );
}
