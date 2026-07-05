import { useAuth } from "@/context/AuthContext";
import { useDashboardRevenueChart } from "@/hooks/useDashboardQueries";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";
import EmptyState from "../reuseable/EmptyState";

interface RevenueChartProps {
  filterBy: string;
}

export default function RevenueChart({ filterBy }: RevenueChartProps) {
  const { token } = useAuth();
  const { data: revenueChart = [], isLoading } = useDashboardRevenueChart(token || "", filterBy);

  if (isLoading) {
    return (
      <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[160px] justify-center items-center">
        <Text className="text-xs text-accent">Loading revenue...</Text>
      </View>
    );
  }

  // Dimensions
  const chartWidth = 310;
  const chartHeight = 130;
  const paddingBottom = 20;
  const paddingTop = 10;
  const paddingLeft = 10;
  const paddingRight = 10;

  const drawableHeight = chartHeight - paddingTop - paddingBottom;
  const drawableWidth = chartWidth - paddingLeft - paddingRight;

  const maxVal =
    revenueChart.length > 0 ? Math.max(...revenueChart.map((d: any) => parseFloat(d.value) || 0), 1) : 1;

  const barWidth = Math.max(12, Math.min(24, drawableWidth / (revenueChart.length || 1) - 8));
  const stepX = drawableWidth / (revenueChart.length || 1);

  return (
    <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xs font-bold text-accent tracking-widest uppercase">
          Revenue {filterBy === "this_week" ? "This Week" : "This Month"}
        </Text>
        <MaterialIcons name="show-chart" size={20} color="#6E6E6E" />
      </View>

      {revenueChart.length === 0 ? (
        <EmptyState description="No revenue data available" pyClassName="py-8" />
      ) : (
        <View style={{ height: 130, alignItems: "center", justifyContent: "center" }}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Horizontal baseline */}
            <Line
              x1={paddingLeft}
              y1={chartHeight - paddingBottom}
              x2={chartWidth - paddingRight}
              y2={chartHeight - paddingBottom}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            {revenueChart.map((d: any, idx: number) => {
              const val = parseFloat(d.value) || 0;
              const barHeight = (val / maxVal) * drawableHeight;

              // Coordinates
              const x = paddingLeft + idx * stepX + (stepX - barWidth) / 2;
              const y = chartHeight - paddingBottom - barHeight;

              return (
                <G key={idx}>
                  {/* Revenue Bar */}
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(2, barHeight)}
                    fill="#DC2D2A"
                    rx={2}
                    ry={2}
                  />
                  {/* X Axis Label */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight - 4}
                    fill="#6E6E6E"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {d.label}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>
      )}
    </View>
  );
}
