import ActionCard from "@/components/reuseable/cards/ActionCard";
import EmptyState from "@/components/reuseable/EmptyState";
import { useData } from "@/src/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import RevenueChartSkeleton from "./skeletons/RevenueChartSkeleton";

import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

interface RevenueChartProps {
  filterBy: string;
  revenueChart: any[];
  isLoading: boolean;
}

export default function RevenueChart({
  filterBy,
  revenueChart = [],
  isLoading,
}: RevenueChartProps) {
  const { settings } = useData();
  const { width: screenWidth } = useWindowDimensions();
  const [focusedBarIndex, setFocusedBarIndex] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    setFocusedBarIndex(undefined);
  }, [filterBy]);

  // Direct calculations (O(1) / simple lookups - no useMemo overhead needed)
  const currencySymbol = getCurrencySymbol(settings?.currency);
  const safeRevenueChart = revenueChart || [];
  const totalRevenue = safeRevenueChart.reduce(
    (sum: number, d: any) => sum + (parseFloat(d.value) || 0),
    0,
  );

  // Dimension helpers
  const chartHeight = 210;
  const isMonthFilter = safeRevenueChart.length > 7;
  // Card padding is p-4 (32px total). Deduct padding + Y-axis margin.
  const chartWidth = screenWidth - 32;
  const availableChartArea = chartWidth - 50; // Reserve ~50px for Y-axis text & labels

  // Dynamically compute bar width & spacing so both weekly and monthly charts are justified across the screen
  const { barWidth, barSpacing, initialSpacing } = useMemo(() => {
    const count = safeRevenueChart.length || 1;
    if (isMonthFilter) {
      const initSpace = 4;
      const spaceBetween = count > 20 ? 2 : 4;
      const availableForBars = availableChartArea - initSpace * 2;
      const computedWidth =
        (availableForBars - spaceBetween * (count - 1)) / count;
      const finalBarWidth = Math.max(
        3,
        Math.min(20, Math.floor(computedWidth)),
      );
      const finalSpacing = Math.max(
        1,
        Math.floor(
          (availableForBars - finalBarWidth * count) / Math.max(1, count - 1),
        ),
      );
      return {
        barWidth: finalBarWidth,
        barSpacing: finalSpacing,
        initialSpacing: initSpace,
      };
    }

    // Weekly View (e.g. 7 days): Justify bars across availableChartArea with generous width and spacing
    const initSpace = 12;
    const availableForBars = availableChartArea - initSpace * 2;
    const targetSpacing = 20;
    const computedWidth =
      (availableForBars - targetSpacing * (count - 1)) / count;
    const finalBarWidth = Math.max(12, Math.min(28, Math.floor(computedWidth)));
    const finalSpacing = Math.max(
      8,
      Math.floor(
        (availableForBars - finalBarWidth * count) / Math.max(1, count - 1),
      ),
    );
    return {
      barWidth: finalBarWidth,
      barSpacing: finalSpacing,
      initialSpacing: initSpace,
    };
  }, [safeRevenueChart.length, isMonthFilter, availableChartArea]);

  // Prepare chart data mapped for react-native-gifted-charts (Heavy: maps array, instantiates sub-components)
  const data = useMemo(() => {
    return safeRevenueChart.map((d: any, index: number) => {
      const val = parseFloat(d.value) || 0;
      const item: any = {
        value: val,
        frontColor: "#DC2D2A",
        gradientColor: "#FF9E93",
        showGradient: true,
        barBorderTopLeftRadius: 4,
        barBorderTopRightRadius: 4,
        barBorderRadius: 0,
        barStyle: {
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          borderRadius: 4,
        },
        name: d.name, // keep reference of full name for tooltips
      };

      if (isMonthFilter) {
        // Extract day number (e.g. "01 Jul" -> 1, "05 Jul" -> 5, or fallback to index + 1)
        const parsedDay = parseInt(String(d.name || "").replace(/\D/g, ""), 10);
        const dayNum =
          !isNaN(parsedDay) && parsedDay > 0 ? parsedDay : index + 1;

        // Display labels only every 5 days (e.g. 1, 5, 10, 15, 20, 25, 30)
        const showLabel = dayNum === 1 || dayNum % 5 === 0;
        const targetLabelWidth = 28;
        const marginLeft = (barWidth - targetLabelWidth + barSpacing) / 2;

        item.labelComponent = () => (
          <View
            style={{
              width: targetLabelWidth,
              marginLeft,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                color: "#6E6E6E",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {showLabel ? String(dayNum) : ""}
            </Text>
          </View>
        );
      } else {
        const targetLabelWidth = 36;
        const marginLeft = (barWidth - targetLabelWidth + barSpacing) / 2;

        item.labelComponent = () => (
          <View
            style={{
              width: targetLabelWidth,
              marginLeft,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                color: "#6E6E6E",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {d.name}
            </Text>
          </View>
        );
      }

      return item;
    });
  }, [safeRevenueChart, isMonthFilter, barWidth, barSpacing]);

  // Derived values from data
  const maxDataValue =
    data.length > 0 ? Math.max(...data.map((d: any) => d.value), 0) : 0;
  const focusedItem =
    focusedBarIndex !== undefined &&
    focusedBarIndex >= 0 &&
    data[focusedBarIndex]
      ? data[focusedBarIndex]
      : undefined;

  // Absolutely positioned tooltip coordinates (recomputes coordinate math only when focus or dimensions change)
  const tooltipPos = useMemo(() => {
    if (focusedBarIndex === undefined || !focusedItem) return undefined;

    const line1 = `${focusedItem.name}:`;
    const line2 = formatAmount(focusedItem.value, currencySymbol || "£");
    const longestLineLen = Math.max(line1.length, line2.length);
    const estimatedTooltipWidth = Math.max(48, longestLineLen * 5.5 + 16);

    // Center tooltip over focused bar within availableChartArea
    const barCenterX =
      initialSpacing + focusedBarIndex * (barWidth + barSpacing) + barWidth / 2;
    const idealLeft = barCenterX - estimatedTooltipWidth / 2;
    const clampedLeft = Math.max(
      4,
      Math.min(idealLeft, availableChartArea - estimatedTooltipWidth - 4),
    );

    // Calculate Y position relative to chart height container
    const graphHeight = chartHeight - 85;
    const maxValue = maxDataValue > 0 ? maxDataValue * 1.2 : 1;
    const barHeightRatio = Math.min(
      1,
      Math.max(0, focusedItem.value / maxValue),
    );
    const barHeightPixels = barHeightRatio * graphHeight;

    const barTopY = graphHeight - barHeightPixels + 15;
    const idealTop = barTopY - 40;
    const clampedTop = Math.max(0, idealTop);

    return {
      left: clampedLeft,
      top: clampedTop,
      line1,
      line2,
    };
  }, [
    focusedBarIndex,
    focusedItem,
    barWidth,
    barSpacing,
    initialSpacing,
    availableChartArea,
    chartHeight,
    maxDataValue,
    currencySymbol,
  ]);

  if (isLoading) {
    return <RevenueChartSkeleton />;
  }

  return (
    <Pressable key="loaded" onPress={() => setFocusedBarIndex(undefined)}>
      <ActionCard
        title={
          <View>
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="font-semibold text-neutral capitalize"
            >
              Revenue {filterBy === "this_week" ? "This Week" : "This Month"}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="font-extrabold text-neutral mt-0.5"
            >
              Total: {formatAmount(totalRevenue, currencySymbol)}
            </Text>
          </View>
        }
        bodyStyle={{ paddingHorizontal: WP("4%") }}
        bodyClassName="py-1"
      >
        {revenueChart.length === 0 ? (
          <EmptyState
            description="No revenue data available"
            pyClassName="py-8"
          />
        ) : (
          <View
            style={{
              height: chartHeight,
              width: "100%",
              position: "relative",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart
              data={data}
              width={availableChartArea}
              rulesLength={availableChartArea}
              xAxisLength={availableChartArea}
              endSpacing={0}
              height={chartHeight - 85}
              maxValue={maxDataValue > 0 ? maxDataValue * 1.2 : undefined}
              barWidth={barWidth}
              spacing={barSpacing}
              initialSpacing={initialSpacing}
              labelWidth={isMonthFilter ? 28 : 34}
              disableScroll={true}
              focusedBarIndex={focusedBarIndex}
              onPress={(_item: any, index: number) => {
                setFocusedBarIndex((prev) =>
                  prev === index ? undefined : index,
                );
              }}
              noOfSections={4}
              rulesColor="#E5E7EB"
              rulesType="solid"
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#E5E7EB"
              showGradient
              frontColor="#DC2D2A"
              gradientColor="#FF9E93"
              barBorderTopLeftRadius={4}
              barBorderTopRightRadius={4}
              barBorderRadius={4}
              barStyle={{
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                borderRadius: 4,
              }}
              yAxisTextStyle={{ color: "#6E6E6E", fontSize: 8 }}
              xAxisLabelTextStyle={{
                color: "#6E6E6E",
                fontSize: 8,
                fontWeight: "600",
                textAlign: "center",
              }}
              xAxisLabelsHeight={24}
              activeOpacity={1}
              isAnimated={true}
              focusedBarConfig={{
                color: "#000000ff",
              }}
            />

            {/* Sibling Tooltip Popover */}
            {focusedItem && tooltipPos && (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: tooltipPos.left,
                  top: tooltipPos.top,
                  zIndex: 999,
                  elevation: 10,
                  backgroundColor: "#1F2937",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  alignItems: "flex-start",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 9,
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  {tooltipPos.line1}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 9,
                    fontWeight: "bold",
                    textAlign: "left",
                    marginTop: 1,
                  }}
                >
                  {tooltipPos.line2}
                </Text>
              </View>
            )}
          </View>
        )}
      </ActionCard>
    </Pressable>
  );
}
