import KpiCard from "@/components/reports/KpiCard";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterChips from "@/components/reuseable/FilterChips";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import TableCard from "./TableCard";

const STATUS_CHIPS = [
  { id: "all", label: "All Statuses" },
  { id: "free", label: "Available" },
  { id: "occupied", label: "Occupied" },
  { id: "reserved", label: "Reserved" },
];

interface TablesViewProps {
  tables: any[];
  matrix: {
    total?: number;
    occupied?: number;
    reserved?: number;
    free?: number;
  } | null;
  isLoading: boolean;
}

export default function TablesView({ tables, matrix, isLoading }: TablesViewProps) {
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const areaChips = useMemo(() => {
    const areas = new Set<string>();
    tables.forEach((t) => {
      if (t.area) {
        // Standardize capitalization to title case for display label
        const areaStr = t.area.trim();
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
  }, [tables]);

  const filteredTables = useMemo(() => {
    let result = tables;

    if (selectedArea !== "all") {
      result = result.filter((t) => (t.area || "").toLowerCase() === selectedArea);
    }

    if (selectedStatus !== "all") {
      result = result.filter((t) => {
        const s = (t.status || "").toLowerCase();
        if (selectedStatus === "free") {
          return s === "free" || s === "available";
        }
        return s === selectedStatus;
      });
    }

    return result;
  }, [tables, selectedArea, selectedStatus]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="mt-3 text-xs font-semibold text-accent">Loading tables...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
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
                gradientColors={["#1a3a4a", "#0d1f2a"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Occupied"
                value={String(matrix.occupied ?? 0)}
                iconName="no-meals"
                variant="dark"
                gradientColors={["#4a1a1a", "#2a0d0d"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Reserved"
                value={String(matrix.reserved ?? 0)}
                iconName="event-seat"
                variant="dark"
                gradientColors={["#1a2a4a", "#0d1530"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Available"
                value={String(matrix.free ?? 0)}
                iconName="check-circle"
                variant="dark"
                gradientColors={["#0d2b24", "#061510"]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Area Filter Chips */}
      {areaChips.length > 1 && (
        <View className="mb-4">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-2">Areas</Text>
          <FilterChips chips={areaChips} selectedId={selectedArea} onSelect={setSelectedArea} />
        </View>
      )}

      {/* Status Filter Chips */}
      <View className="mb-6">
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-2">
          Statuses
        </Text>
        <FilterChips chips={STATUS_CHIPS} selectedId={selectedStatus} onSelect={setSelectedStatus} />
      </View>

      {/* Table Cards Grid */}
      {filteredTables.length === 0 ? (
        <EmptyState
          icon="table-restaurant"
          title="No Tables Found"
          description={
            selectedArea === "all" && selectedStatus === "all"
              ? "No restaurant tables have been configured yet."
              : "No tables found matching the selected filter criteria."
          }
        />
      ) : (
        <FlatList
          data={filteredTables}
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
    </View>
  );
}
