import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface KitchenCardProps {
  order: any;
}

export default function KitchenCard({ order }: KitchenCardProps) {
  // Helper to format order type and return corresponding icon details
  const getOrderTypeDetails = (type?: string, tableNumber?: string) => {
    const normalized = (type || "").toLowerCase().replace(/[-_]/g, " ");
    let label = "Other";
    let icon: keyof typeof MaterialIcons.glyphMap = "restaurant";

    if (normalized.includes("delivery")) {
      label = "Delivery";
      icon = "local-shipping";
    } else if (normalized.includes("takeaway") || normalized.includes("take_away")) {
      label = "Take Away";
      icon = "shopping-bag";
    } else if (normalized.includes("eat in")) {
      const tableText = tableNumber && tableNumber !== "0.00" ? ` (Table ${parseFloat(tableNumber)})` : "";
      label = `Eat In${tableText}`;
      icon = "restaurant";
    } else if (normalized.includes("walk in")) {
      label = "Walk In";
      icon = "directions-walk";
    }

    return { label, icon };
  };

  const { label: typeLabel, icon: typeIcon } = getOrderTypeDetails(order.type, order.table_number);
  const isKitchenStatus = (order.status || "").toLowerCase() === "kitchen";

  return (
    <View
      className={`bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm mb-4 border-l-[6px] ${
        isKitchenStatus ? "border-l-primary" : "border-l-primary/30"
      }`}
    >
      {/* Card Header */}
      <View className="flex-row justify-between items-start border-b border-base-200 pb-3 mb-3">
        <View>
          <Text className="text-base font-black text-neutral">Order #{order.id}</Text>
          {order.customer_name ? (
            <Text className="text-xs text-accent font-medium mt-0.5">{order.customer_name}</Text>
          ) : null}
        </View>
        <View className="items-end">
          {/* Status Badge */}
          <View
            className={`flex-row items-center gap-1 px-2.5 py-0.5 rounded-full ${
              isKitchenStatus ? "bg-primary/10" : "bg-emerald-500/10"
            }`}
          >
            <View
              className={`w-1.5 h-1.5 rounded-full ${
                isKitchenStatus ? "bg-primary animate-pulse" : "bg-emerald-500"
              }`}
            />
            <Text
              className={`text-[9px] font-black uppercase tracking-wider ${
                isKitchenStatus ? "text-primary" : "text-emerald-600"
              }`}
            >
              {isKitchenStatus ? "In Progress" : "Pending"}
            </Text>
          </View>
          {/* Date/Time text */}
          <Text className="text-[10px] text-accent mt-1">{order.created_at || order.updated_at || ""}</Text>
        </View>
      </View>

      {/* Order Type Badge */}
      <View className="flex-row items-center gap-1.5 bg-neutral/5 self-start px-2 py-0.5 rounded-lg mb-3">
        <MaterialIcons name={typeIcon} size={14} color="#6E6E6E" />
        <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">{typeLabel}</Text>
      </View>

      {/* Dishes List */}
      <View className="gap-y-2.5">
        {order.detail?.map((item: any, idx: number) => (
          <View key={item.id || idx} className="flex-row items-start">
            {/* Qty Badge */}
            <View className="bg-primary/10 px-2 py-0.5 rounded mr-2 mt-0.5">
              <Text className="text-xs font-black text-primary">{item.qty}x</Text>
            </View>
            {/* Item Name & Variations */}
            <View className="flex-1">
              <Text className="text-sm font-bold text-neutral">{item.dish?.name || "Unknown Item"}</Text>
              {item.variations && item.variations.length > 0 ? (
                <Text className="text-xs text-accent italic mt-0.5">
                  {item.variations
                    .map((v: any) => v?.variation?.name || v?.name)
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      {/* Special Note / Remarks */}
      {order.remarks || order.customer_note || order.initial_note ? (
        <View className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 mt-3.5 flex-row items-start gap-1.5">
          <MaterialIcons name="info-outline" size={14} color="#DC2D2A" style={{ marginTop: 1 }} />
          <View className="flex-1">
            <Text className="text-[10px] font-black text-primary uppercase tracking-wider">
              Notes / Remarks
            </Text>
            <Text className="text-xs font-medium text-neutral mt-0.5">
              {order.remarks || order.customer_note || order.initial_note}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
