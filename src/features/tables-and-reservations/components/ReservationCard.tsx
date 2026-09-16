// 1. React / React Native
import { View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import { Avatar, CustomText } from "@/components/reuseable";

// 5. Feature components & types
import type { IReservation } from "../types/reservation.types";
import AreaBadge from "./shared/AreaBadge";
import ReservationStatusBadge from "./shared/ReservationStatusBadge";
import TableStatusBadge from "./shared/TableStatusBadge";

// 7. Constants/utils
import { formatDateTime, WP } from "@/utils";

interface IReservationCardProps {
  reservation: IReservation;
}

export default function ReservationCard({
  reservation,
}: Readonly<IReservationCardProps>) {
  const dateTimeStr = formatDateTime(
    reservation.reservation_date,
    reservation.reservation_time,
  );

  const tableNumberText = reservation.table
    ? reservation.table.table_number ||
      `Table ${reservation.table.table_no ?? reservation.table.id}`
    : "";

  return (
    <View
      style={{ padding: WP("3.5%"), gap: WP("2.5%") }}
      className="bg-base-300 border border-base-200 rounded-xl shadow-sm flex-col"
    >
      {/* Top: Avatar + Name/Phone + Reservation Status */}
      <View className="flex-row items-center justify-between">
        <View
          style={{ gap: WP("3%") }}
          className="flex-row items-center flex-1 mr-2"
        >
          <Avatar name={reservation.customer_name} size={WP("9.5%")} />
          <View className="flex-1">
            <CustomText
              size="xs"
              weight="bold"
              variant="primary"
              numberOfLines={1}
            >
              {reservation.customer_name || "Guest"}
            </CustomText>
            {reservation.phone ? (
              <CustomText
                size="xs"
                variant="tertiary"
                className="mt-0.5"
                numberOfLines={1}
              >
                {reservation.phone}
              </CustomText>
            ) : null}
          </View>
        </View>
        <ReservationStatusBadge status={reservation.status} />
      </View>

      {/* Middle: Details row (Guests Count & Schedule Time) */}
      <View style={{ gap: WP("4%") }} className="flex-row items-center">
        {reservation.guests_count !== undefined && (
          <View style={{ gap: WP("1.5%") }} className="flex-row items-center">
            <MaterialIcons name="groups" size={WP("4.5%")} color="#6E6E6E" />
            <CustomText size="xs" weight="semibold" variant="tertiary">
              {reservation.guests_count} People
            </CustomText>
          </View>
        )}
        {dateTimeStr !== "" && (
          <View style={{ gap: WP("1.5%") }} className="flex-row items-center">
            <MaterialIcons name="schedule" size={WP("4.5%")} color="#6E6E6E" />
            <CustomText size="xs" weight="semibold" variant="tertiary">
              {dateTimeStr}
            </CustomText>
          </View>
        )}
      </View>

      {/* Bottom: Nested Table Info (if assigned) */}
      {reservation.table && (
        <View
          style={{ paddingTop: WP("3%"), marginTop: WP("1%") }}
          className="border-t border-base-100 flex-row items-center justify-between"
        >
          <View style={{ gap: WP("1.5%") }} className="flex-row items-center">
            <MaterialIcons
              name="table-restaurant"
              size={WP("4%")}
              color="#6E6E6E"
            />
            <CustomText size="xs" weight="bold" variant="primary">
              {tableNumberText}
            </CustomText>
          </View>
          <View className="flex-row items-center gap-2">
            <TableStatusBadge status={reservation.table.status} />
            <AreaBadge area={reservation.table.area} />
          </View>
        </View>
      )}
    </View>
  );
}
