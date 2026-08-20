import { formatAmount } from "@/utils/formatters";
import React, { useEffect, useMemo, useState } from "react";
import {
  DimensionValue,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { BarChart as GiftedBarChart } from "react-native-gifted-charts";

export interface IBarChartDataItem {
  name: string;
  value: number;
  frontColor?: string;
  gradientColor?: string;
  [key: string]: unknown;
}

export interface IBarChartProps {
  data: IBarChartDataItem[];
  currencySymbol?: string;
  chartHeight?: number;
  isAmount?: boolean;
  frontColor?: string;
  gradientColor?: string;
  focusedColor?: string;
  horizontalPadding?: number;
  emptyText?: string;
  rulesColor?: string;
  xAxisColor?: string;
  yAxisTextColor?: string;
  showGradient?: boolean;
  barBorderRadius?: number;
  noOfSections?: number;
}

export default function BarChart({
  data: rawData = [],
  currencySymbol = "$",
  chartHeight = 210,
  isAmount = true,
  frontColor = "#DC2D2A",
  gradientColor = "#FF9E93",
  focusedColor = "#000000ff",
  horizontalPadding = 32,
  emptyText = "No data available",
  rulesColor = "#E5E7EB",
  xAxisColor = "#E5E7EB",
  yAxisTextColor = "#6E6E6E",
  showGradient = true,
  barBorderRadius = 4,
  noOfSections = 4,
}: Readonly<IBarChartProps>) {
  const { width: screenWidth } = useWindowDimensions();
  const [focusedBarIndex, setFocusedBarIndex] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    setFocusedBarIndex(undefined);
  }, [rawData]);

  const safeData = useMemo(() => rawData || [], [rawData]);
  const isDenseFilter = safeData.length > 7;
  const chartWidth = screenWidth - horizontalPadding;
  const availableChartArea = Math.max(100, chartWidth - 50);

  // Dynamically compute bar width & spacing so bars are justified across available area
  const { barWidth, barSpacing, initialSpacing } = useMemo(() => {
    const count = safeData.length || 1;
    if (isDenseFilter) {
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

    const initSpace = count <= 3 ? 20 : 12;
    const availableForBars = availableChartArea - initSpace * 2;
    const targetSpacing = count <= 3 ? 32 : 20;
    const computedWidth =
      (availableForBars - targetSpacing * (count - 1)) / count;
    const maxBarW = count <= 3 ? 48 : 28;
    const finalBarWidth = Math.max(
      12,
      Math.min(maxBarW, Math.floor(computedWidth)),
    );
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
  }, [safeData.length, isDenseFilter, availableChartArea]);

  // Map data to GiftedCharts BarChart structure
  const chartData = useMemo(() => {
    return safeData.map((d, index) => {
      const val =
        typeof d.value === "number"
          ? d.value
          : parseFloat(String(d.value)) || 0;
      const itemFrontColor = d.frontColor || frontColor;
      const itemGradientColor = d.gradientColor || gradientColor;

      const item: Record<string, unknown> = {
        value: val,
        frontColor: itemFrontColor,
        gradientColor: itemGradientColor,
        showGradient,
        barBorderTopLeftRadius: barBorderRadius,
        barBorderTopRightRadius: barBorderRadius,
        barBorderRadius,
        barStyle: {
          borderTopLeftRadius: barBorderRadius,
          borderTopRightRadius: barBorderRadius,
          borderRadius: barBorderRadius,
        },
        name: d.name,
      };

      if (isDenseFilter) {
        const parsedDay = parseInt(String(d.name || "").replace(/\D/g, ""), 10);
        const dayNum =
          !isNaN(parsedDay) && parsedDay > 0 ? parsedDay : index + 1;
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
                color: yAxisTextColor,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {showLabel ? String(dayNum) : ""}
            </Text>
          </View>
        );
      } else {
        const targetLabelWidth = Math.max(28, barWidth + 8);
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
              numberOfLines={1}
              style={{
                fontSize: 9,
                color: yAxisTextColor,
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
  }, [
    safeData,
    frontColor,
    gradientColor,
    showGradient,
    barBorderRadius,
    isDenseFilter,
    barWidth,
    barSpacing,
    yAxisTextColor,
  ]);

  const maxDataValue =
    chartData.length > 0
      ? Math.max(
          ...chartData.map(
            (d: Record<string, unknown>) => Number(d.value) || 0,
          ),
          0,
        )
      : 0;
  const focusedItem =
    focusedBarIndex !== undefined &&
    focusedBarIndex >= 0 &&
    chartData[focusedBarIndex]
      ? (chartData[focusedBarIndex] as { name: string; value: number })
      : undefined;

  // Tooltip coordinates
  const tooltipPos = useMemo(() => {
    if (focusedBarIndex === undefined || !focusedItem) return undefined;

    const line1 = `${focusedItem.name}:`;
    const line2 = isAmount
      ? formatAmount(focusedItem.value, currencySymbol)
      : String(focusedItem.value);
    const longestLineLen = Math.max(line1.length, line2.length);
    const estimatedTooltipWidth = Math.max(48, longestLineLen * 5.5 + 16);

    const barCenterX =
      initialSpacing + focusedBarIndex * (barWidth + barSpacing) + barWidth / 2;
    const idealLeft = barCenterX - estimatedTooltipWidth / 2;
    const clampedLeft = Math.max(
      4,
      Math.min(idealLeft, availableChartArea - estimatedTooltipWidth - 4),
    );

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
    isAmount,
    currencySymbol,
    initialSpacing,
    barWidth,
    barSpacing,
    availableChartArea,
    chartHeight,
    maxDataValue,
  ]);

  if (safeData.length === 0) {
    return (
      <View
        style={{ height: chartHeight as DimensionValue }}
        className="w-full items-center justify-center py-6"
      >
        <Text className="text-xs text-accent italic text-center">
          {emptyText}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      style={{
        height: chartHeight as DimensionValue,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => setFocusedBarIndex(undefined)}
    >
      <GiftedBarChart
        data={chartData}
        width={availableChartArea}
        rulesLength={availableChartArea}
        xAxisLength={availableChartArea}
        endSpacing={0}
        height={chartHeight - 85}
        maxValue={maxDataValue > 0 ? maxDataValue * 1.2 : undefined}
        barWidth={barWidth}
        spacing={barSpacing}
        initialSpacing={initialSpacing}
        labelWidth={isDenseFilter ? 28 : 34}
        disableScroll={true}
        focusedBarIndex={focusedBarIndex}
        onPress={(_item: unknown, index: number) => {
          setFocusedBarIndex((prev) => (prev === index ? undefined : index));
        }}
        noOfSections={noOfSections}
        rulesColor={rulesColor}
        rulesType="solid"
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={xAxisColor}
        showGradient={showGradient}
        frontColor={frontColor}
        gradientColor={gradientColor}
        barBorderTopLeftRadius={barBorderRadius}
        barBorderTopRightRadius={barBorderRadius}
        barBorderRadius={barBorderRadius}
        barStyle={{
          borderTopLeftRadius: barBorderRadius,
          borderTopRightRadius: barBorderRadius,
          borderRadius: barBorderRadius,
        }}
        yAxisTextStyle={{ color: yAxisTextColor, fontSize: 8 }}
        xAxisLabelTextStyle={{
          color: yAxisTextColor,
          fontSize: 8,
          fontWeight: "600",
          textAlign: "center",
        }}
        xAxisLabelsHeight={24}
        activeOpacity={1}
        isAnimated={true}
        focusedBarConfig={{
          color: focusedColor,
        }}
      />

      {/* Popover Tooltip */}
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
    </Pressable>
  );
}
