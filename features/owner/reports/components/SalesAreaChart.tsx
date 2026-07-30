import ActionCard from "@/components/reuseable/cards/ActionCard";
import COLORS from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React, { useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import SalesAreaChartSkeleton from "./skeletons/SalesAreaChartSkeleton";

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

  const totalSales = useMemo(() => {
    if (!trendData || !Array.isArray(trendData) || trendData.length === 0) return 0;
    return trendData.reduce((sum: number, item: any) => sum + Number(item.sales || 0), 0);
  }, [trendData]);

  const hasData = chartData.length > 0;
  const maxVal = hasData ? Math.max(...chartData.map((d) => d.value), 1) : 1;

  const { width: screenWidth } = useWindowDimensions();
  const chartContainerWidth = screenWidth - WP("10%"); // deduct screen margins
  const chartWidth = chartContainerWidth - WP("15%"); // reserve space for Y-axis labels

  const initialSpacing = WP("5%");
  const endSpacing = WP("6%");

  const spacing = useMemo(() => {
    const count = chartData.length;
    if (count <= 1) return chartWidth;
    const span = chartWidth - WP("9%");
    return Math.max(30, span / (count - 1));
  }, [chartData.length, chartWidth]);

  return (
    <ActionCard
      title={
        <View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm") }}
            className="font-semibold text-neutral capitalize"
          >
            Sales over time
          </Text>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm") }}
            className="font-extrabold text-neutral mt-0.5"
          >
            Total: {formatAmount(totalSales, currencySymbol)}
          </Text>
        </View>
      }
      isLoading={isLoading}
      skeleton={<SalesAreaChartSkeleton />}
      containerClassName={containerClassName}
      bodyClassName="p-5"
    >
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
            rulesLength={chartWidth}
            xAxisLength={chartWidth}
            height={130}
            maxValue={maxVal > 0 ? maxVal * 1.25 : undefined}
            noOfSections={4}
            spacing={spacing}
            initialSpacing={initialSpacing}
            endSpacing={endSpacing}
            color={COLORS.primary}
            thickness={2.5}
            startFillColor={COLORS.primary}
            endFillColor={COLORS.primary}
            startOpacity={0.25}
            endOpacity={0.01}
            rulesColor={COLORS.base100}
            rulesType="solid"
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={COLORS.base100}
            yAxisTextStyle={{ color: COLORS.accent, fontSize: getResponsiveFontSize("xs") }}
            xAxisLabelTextStyle={{
              color: COLORS.accent,
              fontSize: getResponsiveFontSize("xs"),
              fontWeight: "bold",
              textAlign: "center",
            }}

            pointerConfig={{
              persistPointer: true,
              pointerStripUptoDataPoint: true,
              pointerStripColor: COLORS.accent,
              pointerStripWidth: 1.5,
              strokeDashArray: [2, 5],
              pointerColor: COLORS.primary,
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
    </ActionCard>
  );
}
