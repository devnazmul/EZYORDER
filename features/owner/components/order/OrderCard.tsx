import { Badge, Button, StatusBadge } from "@/components/reuseable";
import { useData } from "@/context/context/DataContext";
import { useUsersQuery } from "@/features/owner/more/hooks/queries/useUserQueries";
import { IOrder } from "@/features/owner/reports/types";
import {
  formatAmount,
  formatDateTime,
  getCurrencySymbol,
  getOrderTypeColor,
  getResponsiveFontSize,
  WP,
} from "@/utils";
import React from "react";
import { Text, View } from "react-native";

export interface IOrderCardProps {
  item: IOrder;
  onViewDetails: () => void;
}

export default function OrderCard({
  item,
  onViewDetails,
}: Readonly<IOrderCardProps>) {
  const { settings } = useData();
  const { data: usersResponse } = useUsersQuery();

  let usersList: {
    id?: string | number;
    first_Name?: string;
    last_Name?: string;
    name?: string;
    email?: string;
  }[] = [];
  if (Array.isArray(usersResponse)) {
    usersList = usersResponse;
  } else if (Array.isArray(usersResponse?.data)) {
    usersList = usersResponse.data;
  } else if (Array.isArray(usersResponse?.data?.data)) {
    usersList = usersResponse.data.data;
  }

  const currencySymbol = getCurrencySymbol(settings?.currency);
  const orderTypeColor = getOrderTypeColor(item.type as string);
  const orderTypeText = (item.type || "Delivery").replaceAll("_", " ");

  let assignedText = "Unassigned";
  if (item.driver) {
    assignedText = `Driver: ${item.driver.first_Name || item.driver.name}`;
  } else if (item.waiter) {
    assignedText = `Waiter: ${item.waiter.first_Name || item.waiter.name}`;
  } else if (item.driver_id) {
    const match = usersList.find(
      (u) => String(u?.id) === String(item.driver_id),
    );
    if (match) {
      assignedText =
        `${match.first_Name || ""} ${match.last_Name || ""}`.trim() ||
        match.name ||
        "Driver";
    }
  } else if (item.waiter_id) {
    const match = usersList.find(
      (u) => String(u?.id) === String(item.waiter_id),
    );
    if (match) {
      assignedText = `${match.first_Name || match.name || match.email || "Waiter"}`;
    }
  }

  const orderDateTime = item.created_at
    ? formatDateTime(item.created_at)
    : "--:--";

  return (
    <View className="bg-base-300 rounded-xl border border-base-200 overflow-hidden shadow-sm mb-4">
      <View style={{ padding: WP("3.5%") }} className="gap-y-3">
        <View className="flex-row justify-between items-start">
          <View className="gap-y-1 flex-1 pr-2">
            <View className="flex-row items-center gap-2">
              <Text
                style={{ fontSize: getResponsiveFontSize("md") }}
                className="font-bold text-neutral"
              >
                #{item.id}
              </Text>
              <Badge
                text={orderTypeText}
                containerStyle={{
                  backgroundColor: `${orderTypeColor}15`,
                  borderColor: `${orderTypeColor}30`,
                  borderWidth: 1,
                }}
                textStyle={{ color: orderTypeColor }}
              />
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") + 2 }}
              className="font-semibold text-neutral"
            >
              {item.customer_name ||
                (item.table_number && Number.parseFloat(item.table_number) > 0
                  ? `Table ${Number.parseFloat(item.table_number)}`
                  : "Walk-in Customer")}
            </Text>
          </View>

          <View className="items-end gap-y-1">
            <StatusBadge status={item.status as string} />
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="text-accent font-medium mt-0.5"
            >
              {orderDateTime}
            </Text>
          </View>
        </View>

        {/* Metadata Details Row */}
        <View className="flex-row flex-wrap justify-between items-center gap-2 border-t border-b border-base-200/50 py-2.5">
          <View className="flex flex-col gap-2">
            <View className="flex-row items-center gap-1">
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent capitalize tracking-wider"
              >
                Source:
              </Text>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-neutral capitalize"
              >
                {String(item.order_app || "").toLowerCase() === "pos"
                  ? "POS"
                  : "Client"}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent capitalize tracking-wider"
              >
                Assigned:
              </Text>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-neutral"
              >
                {assignedText}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent capitalize tracking-wider"
            >
              Payment:
            </Text>
            <StatusBadge status={item.payment_status as string} />
          </View>
        </View>

        {/* Price Row */}
        <View className="flex-row justify-between items-center pt-1">
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="font-bold text-neutral"
          >
            {formatAmount(
              item.amount || item.final_price || "0",
              currencySymbol,
            )}
          </Text>
        </View>
      </View>

      {/* Button Action */}
      <View style={{ paddingHorizontal: WP("4%") }} className="pb-4">
        <Button
          label="View Details"
          onPress={onViewDetails}
          variant="primary"
        />
      </View>
    </View>
  );
}
