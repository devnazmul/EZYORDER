import StatusBadge from "@/components/reuseable/StatusBadge";
import COLORS from "@/constants/colors";
import { formatDateTime } from "@/utils/formatters";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import KitchenItemList from "./KitchenItemList";

interface KitchenCardProps {
  order: any;
}

export default function KitchenCard({ order }: KitchenCardProps) {
  const isKitchenStatus = (order.status || "").toLowerCase() === "kitchen";

  return (
    <View
      style={{ padding: WP("3.5%") }}
      className={`bg-base-300 border border-base-200 rounded-xl shadow-sm mb-4 border-l-[6px] ${
        isKitchenStatus ? "border-l-primary" : "border-l-primary/30"
      }`}
    >
      {/* Card Header */}
      <View className="flex-row justify-between items-start border-b border-base-200 pb-3 mb-3">
        <View>
          <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-neutral">
            #{order.id}
          </Text>
          {order.customer_name ? (
            <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-accent font-bold mt-0.5">
              {order.customer_name}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          {/* Status Badge */}
          <StatusBadge status={isKitchenStatus ? "In Progress" : "Pending"} />

          {/* Date/Time text */}
          <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-accent mt-1">
            {formatDateTime(order.created_at || order.updated_at || "")}
          </Text>
        </View>
      </View>

      {/* Dishes List */}
      <KitchenItemList detail={order.detail} />

      {/* Special Note / Remarks */}
      {order.remarks || order.customer_note || order.initial_note ? (
        <View className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 mt-3.5 flex-row items-start gap-1.5">
          <MaterialIcons
            name="info-outline"
            size={WP("4%")}
            color={COLORS.primary}
            style={{ marginTop: 1 }}
          />
          <View className="flex-1">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-bold text-primary capitalize tracking-wider"
            >
              Notes / Remarks
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-medium text-neutral mt-0.5"
            >
              {order.remarks || order.customer_note || order.initial_note}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
