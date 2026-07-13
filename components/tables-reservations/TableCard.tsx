import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import AreaBadge from "./shared/AreaBadge";
import TableStatusBadge from "./shared/TableStatusBadge";

interface TableCardProps {
  table: {
    id: number | string;
    table_no?: number;
    table_number?: string;
    capacity?: number;
    status?: string;
    area?: string;
    is_active?: boolean;
  };
}

export default function TableCard({ table }: TableCardProps) {
  const tableName =
    table.table_number && table.table_number !== "Table"
      ? table.table_number
      : `Table ${String(table.table_no ?? "").padStart(2, "0")}`;

  return (
    <View className="bg-base-300 border border-base-200 rounded-lg p-4 shadow-sm flex-col justify-between h-[140px]">
      {/* Top row: name + icon */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-black text-neutral tracking-tight">{tableName}</Text>
          <Text className="text-xs font-semibold text-accent mt-0.5">{table.capacity ?? 0} Seats</Text>
        </View>
        <View className="bg-base-200 p-2 rounded-lg">
          <MaterialIcons name="table-restaurant" size={20} color="#8C8C8C" />
        </View>
      </View>

      {/* Status & Area Row */}
      <View className="flex-row items-center justify-between mt-auto">
        <TableStatusBadge status={table.status} />
        <AreaBadge area={table.area} textClassName="text-[9px] font-bold text-accent" />
      </View>
    </View>
  );
}
