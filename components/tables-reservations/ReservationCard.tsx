import { formatDateTime, getInitials } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import AreaBadge from "./shared/AreaBadge";
import ReservationStatusBadge from "./shared/ReservationStatusBadge";
import TableStatusBadge from "./shared/TableStatusBadge";

interface ReservationCardProps {
  reservation: {
    id: number | string;
    customer_name?: string;
    phone?: string;
    email?: string;
    guests_count?: number;
    reservation_date?: string;
    reservation_time?: string;
    table?: {
      id: number | string;
      status?: string;
      table_no?: number;
      table_number?: string;
      capacity?: number;
      area?: string;
      is_active?: boolean;
    };
    status?: string;
  };
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  const statusKey = (reservation.status || "").toLowerCase();
  const initials = getInitials(reservation.customer_name);
  const dateTimeStr = formatDateTime(
    reservation.reservation_date,
    reservation.reservation_time,
  );

  // Avatar background color based on status
  const avatarBg =
    statusKey === "accepted" || statusKey === "approved"
      ? "bg-primary"
      : "bg-base-200";
  const avatarTextColor =
    statusKey === "accepted" || statusKey === "approved"
      ? "text-white"
      : "text-primary";

  return (
    <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm flex-col gap-3">
      {/* Top: Avatar + Name/Phone + Reservation Status */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          <View
            className={`w-10 h-10 rounded-full ${avatarBg} items-center justify-center`}
          >
            <Text className={`text-sm font-bold ${avatarTextColor}`}>
              {initials}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-neutral" numberOfLines={1}>
              {reservation.customer_name || "Guest"}
            </Text>
            {reservation.phone ? (
              <Text className="text-xs text-accent mt-0.5" numberOfLines={1}>
                {reservation.phone}
              </Text>
            ) : null}
          </View>
        </View>
        <ReservationStatusBadge status={reservation.status} />
      </View>

      {/* Middle: Details row (Guests Count & Schedule Time) */}
      <View className="flex-row items-center gap-4">
        {reservation.guests_count !== undefined && (
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="groups" size={16} color="#6E6E6E" />
            <Text className="text-xs font-semibold text-accent">
              {reservation.guests_count} People
            </Text>
          </View>
        )}
        {dateTimeStr !== "" && (
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="schedule" size={16} color="#6E6E6E" />
            <Text className="text-xs font-semibold text-accent">
              {dateTimeStr}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom: Nested Table Info (if assigned) */}
      {reservation.table && (
        <View className="pt-3 border-t border-base-100 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="table-restaurant" size={14} color="#6E6E6E" />
            <Text className="text-xs font-bold text-neutral">
              {reservation.table.table_number && reservation.table.table_number !== "Table"
                ? reservation.table.table_number
                : `Table ${String(reservation.table.table_no ?? "").padStart(2, "0")}`}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TableStatusBadge status={reservation.table.status} />
            <AreaBadge area={reservation.table.area} textClassName="text-[10px] font-bold text-accent" />
          </View>
        </View>
      )}
    </View>
  );
}
