import Badge from "@/components/reuseable/Badge";
import Button from "@/components/reuseable/Button";
import StatusBadge from "@/components/reuseable/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/context/DataContext";
import { useUsersQuery } from "@/hooks/useUserQueries";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { getOrderTypeColor } from "@/utils/orderTypeColors";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

interface OrderCardProps {
  item: any;
  onViewDetails: () => void;
}

export default function OrderCard({ item, onViewDetails }: OrderCardProps) {
  const { settings } = useData();
  const { token } = useAuth();
  const { data: usersResponse } = useUsersQuery(token || "");

  const usersList = useMemo(() => {
    if (!usersResponse) return [];
    if (Array.isArray(usersResponse)) return usersResponse;
    if (Array.isArray(usersResponse.data)) return usersResponse.data;
    if (usersResponse.data && Array.isArray(usersResponse.data.data)) return usersResponse.data.data;
    return [];
  }, [usersResponse]);

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const orderTypeColor = useMemo(() => {
    return getOrderTypeColor(item.type);
  }, [item.type]);

  const orderTypeText = useMemo(() => {
    return (item.type || "Delivery").split("_").join(" ");
  }, [item.type]);

  const assignedText = useMemo(() => {
    if (item.driver) return `Driver: ${item.driver.first_Name || item.driver.name}`;
    if (item.waiter) return `Waiter: ${item.waiter.first_Name || item.waiter.name}`;

    if (item.driver_id) {
      const match = usersList.find((u: any) => String(u.id) === String(item.driver_id));
      if (match) {
        return `${match.first_Name} ${match.last_Name}`;
      }
    }

    if (item.waiter_id) {
      const match = usersList.find((u: any) => String(u.id) === String(item.waiter_id));
      if (match) {
        return `${match.first_Name || match.name || match.email}`;
      }
    }

    return "Unassigned";
  }, [item.driver, item.waiter, item.driver_id, item.waiter_id, usersList]);

  const orderDateTime = useMemo(() => {
    return item.created_at ? formatDateTime(item.created_at) : "--:--";
  }, [item.created_at]);

  // Helper to extract items description
  const getOrderItemsText = (order: any) => {
    if (!order) return "";
    if (order.items_summary) return order.items_summary;
    const detailList = order.detail || order.details;
    if (Array.isArray(detailList) && detailList.length > 0) {
      return detailList
        .map((d: any) => `${d.qty || d.quantity || 1}x ${d.dish?.name || d.dish_name || "Item"}`)
        .join(", ");
    }
    return order.description || "";
  };

  return (
    <View className="bg-base-300 rounded-xl border border-base-200 overflow-hidden shadow-sm mb-4">
      <View style={{ padding: WP("3.5%") }} className="gap-y-3">
        <View className="flex-row justify-between items-start">
          <View className="gap-y-1 flex-1 pr-2">
            <View className="flex-row items-center gap-2">
              <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-neutral">
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
                item.user?.first_Name ||
                (item.table_number && parseFloat(item.table_number) > 0
                  ? `Table ${parseFloat(item.table_number)}`
                  : "Walk-in Customer")}
            </Text>
          </View>

          <View className="items-end gap-y-1">
            <StatusBadge status={item.status} />
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
                {String(item.order_app || "").toLowerCase() === "pos" ? "POS" : "Client"}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent capitalize tracking-wider"
              >
                Assigned:
              </Text>
              <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-semibold text-neutral">
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
            <StatusBadge status={item.payment_status} />
          </View>
        </View>

        {/* Price Row */}
        <View className="flex-row justify-between items-center pt-1">
          <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-neutral">
            {formatAmount(item.amount || item.final_price || "0", currencySymbol)}
          </Text>
        </View>
      </View>

      {/* Button Action */}
      <View style={{ paddingHorizontal: WP("4%") }} className="pb-4">
        <Button label="View Details" onPress={onViewDetails} variant="primary" />
      </View>
    </View>
  );
}
