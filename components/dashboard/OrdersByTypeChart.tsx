import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import EmptyState from "../reuseable/EmptyState";

interface OrdersByTypeChartProps {
  filterBy: string;
  ordersByType: any[];
  isLoading: boolean;
}

export default function OrdersByTypeChart({
  filterBy,
  ordersByType = [],
  isLoading,
}: OrdersByTypeChartProps) {
  const total = ordersByType.reduce((acc: number, curr: any) => acc + (parseInt(String(curr.value)) || 0), 0);

  const COLORS = ["#DC2D2A", "#00677f", "#F97316", "#06B6D4"];

  const getLegendColorClass = (index: number) => {
    switch (index % 4) {
      case 0:
        return "bg-primary";
      case 1:
        return "bg-secondary";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-cyan-500";
      default:
        return "bg-accent";
    }
  };

  if (isLoading) {
    return (
      <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[160px] justify-center items-center">
        <Text className="text-xs text-accent">Loading distribution...</Text>
      </View>
    );
  }

  // SVG Configuration
  const radius = 28;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~175.93

  let accumulatedPercentage = 0;

  return (
    <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
      <View className="flex-row justify-between items-center pb-3 border-b border-base-200 mb-4">
        <Text className="text-sm font-semibold text-neutral capitalize">
          Orders by Type of {filterBy.split("_").join(" ")}
        </Text>
      </View>

      {ordersByType.length === 0 ? (
        <EmptyState description="No distribution data available" pyClassName="py-8" />
      ) : (
        <View className="flex-row items-center justify-between px-2">
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
                  {ordersByType.map((item: any, idx: number) => {
                    const val = parseFloat(String(item.value)) || 0;
                    const percentage = (val / total) * 100;
                    const strokeLength = (percentage / 100) * circumference;
                    const rotateAngle = (accumulatedPercentage / 100) * 360;
                    accumulatedPercentage += percentage;

                    return (
                      <Circle
                        key={idx}
                        cx="48"
                        cy="48"
                        r={radius}
                        fill="transparent"
                        stroke={COLORS[idx % COLORS.length]}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={0}
                        transform={`rotate(${rotateAngle} 48 48)`}
                      />
                    );
                  })}
                </G>
              )}
            </Svg>
          </View>

          {/* List Legend items with percentages */}
          <View className="flex-1 ml-6 gap-y-2">
            {ordersByType.map((t: any, index: number) => {
              console.log(t);
              const countVal = parseInt(String(t.value)) || 0;
              const percent = total > 0 ? ((countVal / total) * 100).toFixed(0) : "0";
              const colorClass = getLegendColorClass(index);

              return (
                <View key={index} className="flex-row items-center justify-between w-[70%] mx-auto">
                  <View className="flex-row items-center gap-2">
                    <View className={`w-2 h-2 rounded-full ${colorClass}`} />
                    <Text className="text-xs font-medium text-black capitalize">{t.name} </Text>
                  </View>
                  <Text className="text-xs font-bold text-neutral">{percent}%</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
