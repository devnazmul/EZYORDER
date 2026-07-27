import EmptyState from "@/components/reuseable/EmptyState";
import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface RevenueChartProps {
  filterBy: string;
  revenueChart: any[];
  isLoading: boolean;
}

export default function RevenueChart({ filterBy, revenueChart = [], isLoading }: RevenueChartProps) {
  const { settings } = useData();

  console.log("Revenue data", revenueChart);

  // Resolve currency symbol
  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return revenueChart.reduce((sum: number, d: any) => sum + (parseFloat(d.value) || 0), 0);
  }, [revenueChart]);

  if (isLoading) {
    return (
      <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[200px] justify-center items-center">
        <Text className="text-xs text-accent">Loading revenue...</Text>
      </View>
    );
  }

  // Dimension helpers
  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 210;
  const isMonthFilter = revenueChart.length > 7;
  const chartWidth = isMonthFilter ? screenWidth - 32 : screenWidth - 60;

  // Dynamically compute bar width to fit the container width
  const barWidth = useMemo(() => {
    const spacing = isMonthFilter ? 4 : 16;
    const count = revenueChart.length || 1;
    const availableWidth = chartWidth + 70; // deduct margins and Y-axis text space
    const computed = (availableWidth - spacing * (count - 1)) / count;
    return Math.max(4, Math.min(24, computed));
  }, [revenueChart.length, isMonthFilter, chartWidth]);

  // Prepare chart data mapped for react-native-gifted-charts
  const data = useMemo(() => {
    return revenueChart.map((d: any) => {
      const val = parseFloat(d.value) || 0;
      const item: any = {
        value: val,
        frontColor: "#DC2D2A",
        name: d.name, // keep reference of full name for tooltips
      };

      if (isMonthFilter) {
        // Use custom labelComponent for rotated labels in month view
        item.labelComponent = () => (
          <View style={{ width: barWidth, alignItems: "center", marginTop: 24 }}>
            <Text
              style={{
                fontSize: 7,
                color: "#6E6E6E",
                fontWeight: "bold",
                borderColor: "#000000",
                borderWidth: 0,
                minWidth: 50,
                transform: [{ rotate: "-75deg" }],
                marginTop: 10,
                marginBottom: 0,
                marginLeft: 20,
                marginRight: 0,
              }}
            >
              {d.name}
            </Text>
          </View>
        );
      } else {
        item.label = d.name;
      }

      return item;
    });
  }, [revenueChart, isMonthFilter, barWidth]);

  // Compute maximum value in dataset to prevent tooltip clipping at the top
  const maxDataValue = useMemo(() => {
    return Math.max(...data.map((d: any) => d.value), 0);
  }, [data]);

  return (
    <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
      {/* Header with Title and Total Value */}
      <View className="flex-row justify-between items-center pb-3 border-b border-base-200 mb-4">
        <View>
          <Text className="text-sm font-semibold text-neutral capitalize">
            Revenue {filterBy === "this_week" ? "This Week" : "This Month"}
          </Text>
          <Text className="text-base font-extrabold text-neutral mt-0.5">
            Total: {formatAmount(totalRevenue, currencySymbol)}
          </Text>
        </View>
        <MaterialIcons name="show-chart" size={20} color="#6E6E6E" />
      </View>

      {revenueChart.length === 0 ? (
        <EmptyState description="No revenue data available" pyClassName="py-8" />
      ) : (
        <View style={{ height: chartHeight, alignItems: "center", justifyContent: "center" }}>
          <BarChart
            data={data}
            width={chartWidth - 70}
            height={chartHeight - 85}
            maxValue={maxDataValue > 0 ? maxDataValue * 1.2 : undefined}
            barWidth={barWidth}
            spacing={isMonthFilter ? 8 : 16}
            initialSpacing={10}
            noOfSections={4}
            rulesColor="#E5E7EB"
            rulesType="solid"
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor="#E5E7EB"
            yAxisTextStyle={{ color: "#6E6E6E", fontSize: 8 }}
            xAxisLabelTextStyle={{
              color: "#6E6E6E",
              fontSize: 8,
              fontWeight: "bold",
              textAlign: "center",
            }}
            xAxisLabelsHeight={isMonthFilter ? 60 : 20}
            activeOpacity={1}
            isAnimated={true}
            focusedBarConfig={{
              color: "#000000ff",
            }}
            renderTooltip={(item: any, index: number) => {
              const tooltipText = `${item.name}: ${formatAmount(item.value, currencySymbol)}`;
              // Estimate tooltip width: ~5.5px per char at fontSize 9 + 16px horizontal padding
              const estimatedTooltipWidth = tooltipText.length * 5.5 + 16;
              // Center tooltip over the bar
              const centerOffset = -(estimatedTooltipWidth / 2) + barWidth / 2;

              return (
                <View
                  style={{
                    backgroundColor: "#1F2937",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 6,
                    transform: [{ translateX: centerOffset }],
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.5,
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 9, fontWeight: "bold" }}>{tooltipText}</Text>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}
