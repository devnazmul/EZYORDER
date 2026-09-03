import Badge from "@/components/reuseable/Badge";
import StatusBadge from "@/components/reuseable/StatusBadge";
import { useData } from "@/src/context/context/DataContext";
import { formatLabel } from "@/utils/formatLabel";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

interface RecentOrderRowProps {
  order: any;
  index: number;
  isLast?: boolean;
}

export default function RecentOrderRow({ order, index, isLast = false }: RecentOrderRowProps) {
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const customerName = order.customer;

  const formattedPrice = formatAmount(order.price, currencySymbol);

  const orderTime = useMemo(() => {
    if (order.created_at) {
      return formatDateTime(order.created_at);
    }
    return order.time || "";
  }, [order.created_at, order.time]);

  const formattedOrderType = formatLabel(order.type) || "-";

  return (
    <View
      style={{ padding: WP("4%") }}
      className={`flex-row items-center justify-between ${!isLast ? "border-b border-base-200" : ""}`}
    >
      <View className="flex-1 mr-4">
        <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
          #{order.id}
        </Text>
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="text-accent capitalize font-semibold mt-1 opacity-80"
        >
          {customerName} • {formattedOrderType}
          {orderTime ? ` • ${orderTime}` : ""}
        </Text>
        {order.items ? (
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-accent/80 font-medium mt-0.5 truncate"
            numberOfLines={1}
          >
            {order.items}
          </Text>
        ) : null}
      </View>
      <View className="items-end gap-1.5">
        <Badge
          text={formattedPrice}
          containerClassName="bg-info/10 border border-info/30"
          textClassName="text-info"
        />
        <StatusBadge status={order.status} />
      </View>
    </View>
  );
}
