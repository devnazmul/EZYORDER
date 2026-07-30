import React, { useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export interface ChartDataPoint {
  label: string;
  value: number;
}

interface SalesBarChartProps {
  trendData: any;
  currencySymbol: string;
  isLoading?: boolean;
  containerClassName?: string;
}

export default function SalesBarChart({
  trendData,
  currencySymbol = "$",
  isLoading = false,
  containerClassName = "",
}: SalesBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!trendData || !Array.isArray(trendData)) return [];
    return trendData.map((item: any) => ({
      label: String(item.label || "unknown").toUpperCase(),
      value: Number(item.sales || 0),
    }));
  }, [trendData]);

  const hasData = chartData && chartData.length > 0;
  const maxVal = hasData ? Math.max(...chartData.map((d) => d.value), 1) : 1;

  return (
    <View
      className={`bg-base-300 rounded-lg p-5 shadow-sm border border-base-200 min-h-[200px] justify-between relative ${containerClassName}`}
    >
      {isLoading && (
        <View className="absolute inset-0 bg-base-300/60 backdrop-blur-[0.5px] items-center justify-center z-50 rounded-lg">
          <ActivityIndicator size="large" color="#DC2D2A" />
        </View>
      )}

      {/* Header */}
      <View className="mb-4">
        <Text className="text-lg font-bold text-neutral">Daily Revenue</Text>
      </View>

      {!hasData ? (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-xs text-accent text-center">No sales activity recorded for this period.</Text>
        </View>
      ) : (
        /* Columns List Container */
        <View className="flex-row items-end justify-between h-44 px-1 mt-6">
          {chartData.map((item, idx) => {
            const percentage = Math.max((item.value / maxVal) * 100, 5); // minimum height 5% for visibility
            const isActive = activeIndex === idx;

            return (
              <View key={idx} className="flex-1 items-center relative h-full justify-end">
                {/* Tooltip positioned floating absolute above the active column */}
                {isActive && (
                  <View className="absolute -top-10 bg-neutral py-1 px-2.5 rounded-full shadow-md z-40 items-center justify-center min-w-[70px]">
                    <Text className="text-[10px] font-bold text-white whitespace-nowrap">
                      {currencySymbol}
                      {item.value.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    {/* Cares overlay triangle indicator */}
                    <View className="w-1.5 h-1.5 bg-neutral rotate-45 absolute -bottom-0.5" />
                  </View>
                )}

                {/* Tappable column track area */}
                <TouchableOpacity
                  onPress={() => setActiveIndex(isActive ? null : idx)}
                  activeOpacity={0.8}
                  className="w-full items-center py-2 flex-1 justify-end"
                >
                  {/* Track */}
                  <View className="w-3.5 h-28 bg-base-200 rounded-full justify-end overflow-hidden">
                    {/* Filled active bar */}
                    <View
                      style={{ height: `${percentage}%` }}
                      className={`w-full rounded-full ${isActive ? "bg-primary" : "bg-primary/20"}`}
                    />
                  </View>
                </TouchableOpacity>

                {/* Day Label */}
                <View className="mt-2 h-6 items-center justify-center">
                  {isActive ? (
                    <View className="bg-neutral px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] font-black text-white uppercase">{item.label}</Text>
                    </View>
                  ) : (
                    <Text className="text-[10px] font-bold text-accent uppercase">{item.label}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
