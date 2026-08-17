import Badge from "@/components/reuseable/Badge";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { Text, View } from "react-native";

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

const TableIcon = ({ chairsCount = 4, size = 54 }: { chairsCount: number; size?: number }) => {
  const chairs = chairsCount || 4;
  const tableSize = size * 0.625;
  const chairWidth = size * 0.1875;
  const chairHeight = size * 0.125;
  const translateYVal = -size * 0.4375;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Table Surface */}
      <View
        style={{
          width: tableSize,
          height: tableSize,
          borderRadius: tableSize * 0.25,
          backgroundColor: "#fed7aa", // bg-orange-200
          borderColor: "#ffedd5", // border-orange-100/50
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: tableSize * 0.6,
            height: tableSize * 0.6,
            borderRadius: tableSize * 0.15,
            backgroundColor: "#fdba74", // bg-orange-300
            opacity: 0.3,
          }}
        />
      </View>

      {/* Dynamic Chairs */}
      {Array.from({ length: chairs }).map((_, i) => {
        const rotation = (i * 360) / chairs;
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              width: chairWidth,
              height: chairHeight,
              backgroundColor: "#fb923c", // bg-orange-400
              borderRadius: chairHeight * 0.25,
              opacity: 0.6,
              transform: [{ rotate: `${rotation}deg` }, { translateY: translateYVal }],
            }}
          />
        );
      })}
    </View>
  );
};

export default function TableCard({ table }: TableCardProps) {
  const statusConfig: Record<
    string,
    { badgeBg: string; badgeText: string; badgeLabel: string; circleBg: string }
  > = {
    occupied: {
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-600",
      badgeLabel: "Occupied",
      circleBg: "bg-rose-50",
    },
    free: {
      badgeBg: "bg-green-100",
      badgeText: "text-green-600",
      badgeLabel: "Available",
      circleBg: "bg-green-50",
    },
    available: {
      badgeBg: "bg-green-100",
      badgeText: "text-green-600",
      badgeLabel: "Available",
      circleBg: "bg-green-50",
    },
    reserved: {
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-600",
      badgeLabel: "Reserved",
      circleBg: "bg-blue-50",
    },
  };

  const statusKey = (table.status || "").toLowerCase().trim();
  const cfg = statusConfig[statusKey] || {
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    badgeLabel: table.status || "Unknown",
    circleBg: "bg-slate-50",
  };

  const tableName =
    table.table_number && table.table_number !== "Table"
      ? table.table_number
      : `Table-${table.table_no || ""}`;

  return (
    <View
      style={{
        padding: WP("3%"),
        minHeight: 155,
      }}
      className={`rounded-2xl border border-base-200 flex-col justify-between ${
        table?.is_active ? "bg-base-300" : "bg-red-500/10"
      }`}
    >
      {/* Top row: Icon + Badges */}
      <View className="flex-row items-start justify-between">
        <View
          className={`rounded-xl ${cfg?.circleBg || "bg-slate-50"} flex items-center justify-center shadow-sm p-4`}
        >
          <TableIcon chairsCount={table.capacity ?? 4} size={WP("10%")} />
        </View>

        <View className="flex-col items-end gap-1.5">
          {cfg && (
            <Badge
              text={cfg.badgeLabel}
              containerClassName={`${cfg.badgeBg} border-0`}
              textClassName={`font-bold capitalize ${cfg.badgeText}`}
              textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
            />
          )}
          <Badge
            text={table?.is_active ? "Active" : "Inactive"}
            containerClassName={`${table?.is_active ? "bg-green-100" : "bg-rose-100"} border-0`}
            textClassName={`font-bold capitalize ${table?.is_active ? "text-green-600" : "text-rose-600"}`}
            textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
          />
          <Badge
            text={table?.area || "General"}
            containerClassName="bg-orange-100 border-0"
            textClassName="font-bold capitalize text-orange-600"
            textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
          />
        </View>
      </View>

      {/* Info Section */}
      <View className="mt-3">
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="font-bold text-neutral capitalize tracking-tight truncate"
        >
          {tableName}
        </Text>
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="font-semibold text-accent mt-1 capitalize"
        >
          {table.capacity ?? 0} Capacity
        </Text>
      </View>
    </View>
  );
}
