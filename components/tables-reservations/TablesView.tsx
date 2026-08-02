import KpiCard from "@/components/reuseable/dashboard/KpiCard";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer from "@/components/reuseable/FilterDrawer";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import SearchBar from "@/components/reuseable/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useAllTablesQuery, useTableMatrixQuery } from "@/hooks/useTableReservationQueries";
import { getResponsiveFontSize, HP } from "@/utils/getResponsiveSizes";
import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import TableCard from "./TableCard";
import TableCardSkeleton from "./TableCardSkeleton";

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

interface TablesViewProps {
  header?: React.ReactNode;
}

export default function TablesView({ header }: TablesViewProps) {
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
    isFetching: isTablesFetching,
    refetch: refetchTables,
  } = useAllTablesQuery(token || "", apiParams);

  // Fetch tables KPI matrix
  const {
    data: matrixData,
    isLoading: isMatrixLoading,
    isFetching: isMatrixFetching,
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

  const isMatrixLoadingOrFetching = isMatrixLoading || isMatrixFetching;

  return (
    <RefreshableScrollView
      onRefresh={handleRefresh}
      className="flex-1"
      contentContainerStyle={{ paddingBottom: HP("2%") }}
    >
      {header}
      {/* KPI Stats Grid */}
      {(matrix || isMatrixLoadingOrFetching) && (
        <View className="mb-3">
          <View className="flex-col gap-2">
            {/* Row 1 */}
            <View className="flex-row flex-1 gap-2">
              <View className="flex-1">
                <KpiCard
                  title="Total Tables"
                  value={String(matrix?.total ?? 0)}
                  icon="restaurant"
                  variant="dark"
                  iconBgColor="#14B8A6"
                  iconColor="#ffffff"
                  gradientColors={["#2d3e56", "#1b283c"]}
                  loading={isMatrixLoadingOrFetching}
                />
              </View>
              <View className="flex-1">
                <KpiCard
                  title="Occupied"
                  value={String(matrix?.occupied ?? 0)}
                  icon="cancel"
                  variant="dark"
                  iconBgColor="#F43F5E"
                  iconColor="#ffffff"
                  gradientColors={["#1e4f43", "#11322b"]}
                  loading={isMatrixLoadingOrFetching}
                />
              </View>
            </View>

            {/* Row 2 */}
            <View className="flex-row flex-1 gap-2">
              <View className="flex-1">
                <KpiCard
                  title="Reserved"
                  value={String(matrix?.reserved ?? 0)}
                  icon="event-seat"
                  variant="dark"
                  iconBgColor="#8B5CF6"
                  iconColor="#ffffff"
                  gradientColors={["#4c3590", "#2e1e5c"]}
                  loading={isMatrixLoadingOrFetching}
                />
              </View>
              <View className="flex-1">
                <KpiCard
                  title="Available"
                  value={String(matrix?.free ?? 0)}
                  icon="check-circle"
                  variant="dark"
                  iconBgColor="#10B981"
                  iconColor="#ffffff"
                  gradientColors={["#6d242b", "#3d1115"]}
                  loading={isMatrixLoadingOrFetching}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Search & Filter Header Row */}
      <View className="flex-row items-center gap-2 mb-3">
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
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-bold text-accent capitalize tracking-wider"
          >
            Matching {tables.length} Tables
          </Text>
        </View>
      )}

      {/* Table Cards Grid */}
      {isTablesLoading || isTablesFetching ? (
        <View key="loading" className="flex-1">
          <FlatList
            data={Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-${i}` }))}
            keyExtractor={(item) => item.id}
            numColumns={2}

            contentContainerClassName="gap-2"
            columnWrapperClassName="gap-2"
            scrollEnabled={false}
            renderItem={() => (
              <View className="flex-1">
                <TableCardSkeleton />
              </View>
            )}
          />
        </View>
      ) : tables.length === 0 ? (
        <View key="empty" className="flex-1">
          <EmptyState
            icon="table-restaurant"
            title="No Tables Found"
            description={
              searchQuery || activeFilterCount > 0
                ? "No tables found matching the selected filter criteria."
                : "No restaurant tables have been configured yet."
            }
          />
        </View>
      ) : (
        <View key="loaded" className="flex-1">
          <FlatList
            data={tables}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}

            columnWrapperClassName="gap-2"
            contentContainerClassName="gap-2"
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="flex-1">
                <TableCard table={item} />
              </View>
            )}
          />
        </View>
      )}
    </RefreshableScrollView>
  );
}
