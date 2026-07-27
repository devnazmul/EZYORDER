import EmptyState from "@/components/reuseable/EmptyState";
import ActionCard from "@/components/reuseable/cards/ActionCard";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { getOrderTypeColor } from "../constants/orderTypeColors";

interface OrderTypeItem {
  name: string;
  value: number;
}

interface OrdersByTypeChartProps {
  filterBy: string;
  ordersByType: OrderTypeItem[];
  isLoading: boolean;
}

export default function OrdersByTypeChart({
  filterBy,
  ordersByType = [],
  isLoading,
}: OrdersByTypeChartProps) {
  // Sort order types descending by value (highest to lowest)
  const sortedOrdersByType = useMemo(() => {
    if (!ordersByType || !Array.isArray(ordersByType)) return [];
    return [...ordersByType].sort((a, b) => (b.value || 0) - (a.value || 0));
  }, [ordersByType]);

  const total = sortedOrdersByType.reduce((acc: number, curr: OrderTypeItem) => acc + (curr.value || 0), 0);

  const handleItemPress = (name: string) => {
    const tabKey = String(name || "")
      .toLowerCase()
      .trim()
      .split(" ")
      .join("_");
    router.push({
      pathname: "/orders/all-orders",
      params: {
        tab: tabKey,
        filterBy,
        date_filter: filterBy,
      },
    });
  };

  // SVG Configuration
  const radius = 28;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~175.93

  let accumulatedPercentage = 0;

  return (
    <ActionCard
      title={`Orders by Type of ${filterBy.split("_").join(" ")}`}
      isLoading={isLoading}
      loadingText="Loading distribution..."
      bodyClassName="p-4"
      actionLabel="View All Orders"
      onActionPress={() =>
        router.push({
          pathname: "/orders/all-orders",
          params: {
            tab: "eat_in,delivery,take_away,walk_in",
            filterBy,
            date_filter: filterBy,
          },
        })
      }
    >
      {sortedOrdersByType.length === 0 ? (
        <View key="empty">
          <EmptyState description="No distribution data available" pyClassName="py-8" />
        </View>
      ) : (
        <View className="flex-row items-center justify-between px-2 py-1">
          {/* Custom SVG Donut Pie Chart */}
          <View className="w-24 h-24 items-center justify-center relative">
            <View className="absolute z-10 w-24 h-24 items-center justify-center pointer-events-none">
              <Text className="text-xs font-extrabold text-neutral">{total}</Text>
              <Text className="text-[8px] text-accent font-bold capitalize tracking-wider">Orders</Text>
            </View>
            <Svg width={135} height={135} viewBox="0 0 96 96">
              {/* Background Base Ring */}
              <Circle
                cx="48"
                cy="48"
                r={radius}
                fill="transparent"
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
              />
              {total > 0 && (
                <G transform="rotate(-90 48 48)">
                  {sortedOrdersByType.map((item, idx) => {
                    const percentage = ((item.value || 0) / total) * 100;
                    const strokeLength = (percentage / 100) * circumference;
                    const rotateAngle = (accumulatedPercentage / 100) * 360;
                    accumulatedPercentage += percentage;
                    const color = getOrderTypeColor(item.name);

                    return (
                      <Circle
                        key={idx}
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={0}
                        transform={`rotate(${rotateAngle} 48 48)`}
                        onPress={() => handleItemPress(item.name)}
                      />
                    );
                  })}
                </G>
              )}
            </Svg>
          </View>

          {/* List Legend items with percentages */}
          <View className="flex-1 ml-6 gap-y-2">
            {sortedOrdersByType.map((t, index) => {
              const countVal = t.value || 0;
              const percent = total > 0 ? ((countVal / total) * 100).toFixed(0) : "0";
              const color = getOrderTypeColor(t.name);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleItemPress(t.name)}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between w-[90%] py-0.5 mx-auto"
                >
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <Text className="text-xs font-medium text-neutral capitalize">{t.name}</Text>
                    <Text className="text-xs font-medium text-neutral/40">({percent}%)</Text>
                  </View>
                  <Text className="text-xs font-bold text-neutral">{countVal}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </ActionCard>
  );
}
