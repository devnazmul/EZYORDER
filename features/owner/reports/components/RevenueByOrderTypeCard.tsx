import ActionCard from "@/components/reuseable/cards/ActionCard";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { getOrderTypeColor } from "@/utils/orderTypeColors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import RevenueByOrderTypeSkeleton from "./skeletons/RevenueByOrderTypeSkeleton";

interface RevenueByOrderTypeCardProps {
  orderTypeData: any;
  netSales: number;
  currencySymbol: string;
  isLoading?: boolean;
  containerClassName?: string;
}

const getIcon = (type: string): keyof typeof MaterialIcons.glyphMap => {
  const norm = type.toLowerCase().replace("-", "_");
  if (norm.includes("delivery")) return "delivery-dining";
  if (norm.includes("eat_in") || norm.includes("dine_in")) return "restaurant";
  if (norm.includes("take_away") || norm.includes("takeaway")) return "takeout-dining";
  if (norm.includes("walk_in") || norm.includes("walkin")) return "person-add";
  return "shopping-bag";
};

const formatLabel = (type: string) => {
  return type.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function RevenueByOrderTypeCard({
  orderTypeData,
  netSales = 0,
  currencySymbol,
  isLoading = false,
  containerClassName = "",
}: Readonly<RevenueByOrderTypeCardProps>) {
  const list = Array.isArray(orderTypeData) ? orderTypeData : [];

  return (
    <ActionCard
      title="Revenue by Order Type"
      isLoading={isLoading}
      skeleton={<RevenueByOrderTypeSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
    >
      <View className="gap-y-4">
        {list.length === 0 ? (
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-accent italic text-center py-4"
          >
            No order data for this period.
          </Text>
        ) : (
          list.map((item: any, i: number) => {
            const val = Number(item.amount || item.value || 0);
            const percent = netSales > 0 ? Math.min(Math.round((val / netSales) * 100), 100) : 0;
            const label = formatLabel(item.order_type || "");
            const icon = getIcon(item.order_type || "");
            const typeColor = getOrderTypeColor(item.order_type || "");

            return (
              <View key={item.order_type || i} className="gap-y-2 mb-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-2 items-center flex-1 min-w-0 mr-2">
                    <MaterialIcons name={icon} size={WP("4.5%")} color={typeColor} />
                    <Text
                      style={{ fontSize: getResponsiveFontSize("sm") }}
                      className="font-semibold text-neutral truncate"
                      numberOfLines={1}
                    >
                      {label}
                    </Text>
                  </View>
                  <Text
                    style={{ fontSize: getResponsiveFontSize("sm") }}
                    className="font-semibold text-neutral shrink-0"
                  >
                    {formatAmount(val, currencySymbol)} ({percent}%)
                  </Text>
                </View>

                <View
                  style={{ height: HP("1%") }}
                  className="w-full bg-base-200 rounded-full overflow-hidden"
                >
                  <View
                    style={{ width: `${percent}%`, backgroundColor: typeColor }}
                    className="h-full rounded-full"
                  />
                </View>
              </View>
            );
          })
        )}
      </View>
    </ActionCard>
  );
}
