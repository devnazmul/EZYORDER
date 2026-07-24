import { formatAmount } from "@/utils/formatters";
import React, { useMemo } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface SalesAreaChartProps {
  trendData: any;
  currencySymbol: string;
  isLoading?: boolean;
  containerClassName?: string;
}

const formatLabel = (label: string) => {
  if (!label) return "";
  // Format YYYY-MM-DD to short date
  let match = label.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, year, month, day] = match;
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  // Format DD-MM-YYYY to short date
  match = label.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (match) {
    const [_, day, month, year] = match;
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return label;
};

export default function SalesAreaChart({
  trendData,
  currencySymbol,
  isLoading = false,
  containerClassName = "",
}: SalesAreaChartProps) {

  const chartData = useMemo(() => {
    if (!trendData || !Array.isArray(trendData) || trendData.length === 0) return [];
    return trendData.map((item: any) => ({
      value: Number(item.sales || 0),
      label: formatLabel(String(item.label || "")),
    }));
  }, [trendData]);

  const hasData = chartData.length > 0;
  const maxVal = hasData ? Math.max(...chartData.map((d) => d.value), 1) : 1;

  const screenWidth = Dimensions.get("window").width;
  const chartContainerWidth = screenWidth - 32;
  const chartWidth = chartContainerWidth - 80;

  const initialSpacing = 20;
  const endSpacing = 25;

  const spacing = useMemo(() => {
    const count = chartData.length;
    if (count <= 1) return chartWidth;
    const span = chartWidth - 35;
    return Math.max(30, span / (count - 1));
  }, [chartData.length, chartWidth]);

  return (
    <View
      className={`bg-base-300 rounded-lg p-5 shadow-sm border border-base-200 min-h-[220px] justify-between relative ${containerClassName}`}
    >
      {isLoading && (
        <View className="absolute inset-0 bg-base-300/60 backdrop-blur-[0.5px] items-center justify-center z-50 rounded-lg">
          <ActivityIndicator size="large" color="#DC2D2A" />
        </View>
      )}

      <View className="mb-4">
        <Text className="text-md font-bold text-neutral">Sales Trend</Text>
      </View>

      {!hasData ? (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-xs text-accent text-center">No sales trend recorded for this period.</Text>
        </View>
      ) : (
        <View className="items-center justify-center mt-4">
          <LineChart
            areaChart
            data={chartData}
            width={chartWidth}
            height={130}
            maxValue={maxVal > 0 ? maxVal * 1.25 : undefined}
            noOfSections={4}
            spacing={spacing}
            initialSpacing={initialSpacing}
            endSpacing={endSpacing}
            color="#DC2D2A"
            thickness={2.5}
            startFillColor="#DC2D2A"
            endFillColor="#DC2D2A"
            startOpacity={0.25}
            endOpacity={0.01}
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
            pointerConfig={{
              persistPointer: true,
              pointerStripUptoDataPoint: true,
              pointerStripColor: "lightgray",
              pointerStripWidth: 1.5,
              strokeDashArray: [2, 5],
              pointerColor: "#DC2D2A",
              radius: 4,
              pointerLabelComponent: (items: any) => {
                if (!items || !items.length) return null;
                const tooltipText = formatAmount(items[0].value, currencySymbol);
                return (
                  <View
                    style={{
                      backgroundColor: "#1F2937",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 80,
                      marginBottom: 6,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.5,
                      elevation: 30,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 9, fontWeight: "bold" }}>
                      {items[0].label ? `${items[0].label}: ` : ""}
                      {tooltipText}
                    </Text>
                  </View>
                );
              },
            }}
          />
        </View>
      )}
    </View>
  );
}
