// 1. React / React Native
import React, { useEffect, useState } from "react";
import {
  DimensionValue,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// 3. External libraries
import { BarChart as GiftedBarChart } from "react-native-gifted-charts";

// 5. Shared hooks
import { useInView } from "@/hooks";

// 7. Constants/utils
import { COLORS } from "@/constants";
import { formatAmount } from "@/utils";

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
  showValuesAsTopLabel?: boolean;
  barBorderRadius?: number;
  noOfSections?: number;
  isAnimated?: boolean;
  animationDuration?: number;
}

// ==================== HELPER FUNCTIONS ====================

interface IBarLayout {
  barWidth: number;
  barSpacing: number;
  initialSpacing: number;
}

function calculateBarLayout(
  totalCount: number,
  availableChartArea: number,
): IBarLayout {
  const count = totalCount || 1;
  const isDenseFilter = totalCount > 7;

  if (isDenseFilter) {
    const initialSpacing = 4;
    const spaceBetween = count > 20 ? 2 : 4;
    const availableForBars = availableChartArea - initialSpacing * 2;
    const computedWidth =
      (availableForBars - spaceBetween * (count - 1)) / count;
    const barWidth = Math.max(3, Math.min(20, Math.floor(computedWidth)));
    const barSpacing = Math.max(
      1,
      Math.floor(
        (availableForBars - barWidth * count) / Math.max(1, count - 1),
      ),
    );
    return { barWidth, barSpacing, initialSpacing };
  }

  const initialSpacing = count <= 3 ? 20 : 12;
  const availableForBars = availableChartArea - initialSpacing * 2;
  const targetSpacing = count <= 3 ? 32 : 20;
  const computedWidth =
    (availableForBars - targetSpacing * (count - 1)) / count;
  const maxBarW = count <= 3 ? 48 : 28;
  const barWidth = Math.max(12, Math.min(maxBarW, Math.floor(computedWidth)));
  const barSpacing = Math.max(
    8,
    Math.floor((availableForBars - barWidth * count) / Math.max(1, count - 1)),
  );
  return { barWidth, barSpacing, initialSpacing };
}

function computeVisibleIndices(totalCount: number): Set<number> {
  if (totalCount <= 5) {
    return new Set(Array.from({ length: totalCount }, (_, i) => i));
  }
  const maxIndex = totalCount - 1;
  return new Set([
    0,
    Math.round(maxIndex * 0.25),
    Math.round(maxIndex * 0.5),
    Math.round(maxIndex * 0.75),
    maxIndex,
  ]);
}

interface ITooltipCoords {
  left: number;
  top: number;
  line1: string;
  line2: string;
}

interface ITooltipParams {
  focusedBarIndex: number;
  focusedItem: { name: string; value: number };
  barWidth: number;
  barSpacing: number;
  initialSpacing: number;
  availableChartArea: number;
  chartHeight: number;
  maxDataValue: number;
  isAmount: boolean;
  currencySymbol: string;
}

function calculateTooltipPosition(params: ITooltipParams): ITooltipCoords {
  const {
    focusedBarIndex,
    focusedItem,
    barWidth,
    barSpacing,
    initialSpacing,
    availableChartArea,
    chartHeight,
    maxDataValue,
    isAmount,
    currencySymbol,
  } = params;

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
  const barHeightRatio = Math.min(1, Math.max(0, focusedItem.value / maxValue));
  const barHeightPixels = barHeightRatio * graphHeight;

  const barTopY = graphHeight - barHeightPixels + 15;
  const idealTop = barTopY - 40;
  const clampedTop = Math.max(0, idealTop);

  return { left: clampedLeft, top: clampedTop, line1, line2 };
}

export default function BarChart({
  data: rawData = [],
  currencySymbol = "$",
  chartHeight = 210,
  isAmount = true,
  frontColor = COLORS.primary,
  gradientColor = "#FF9E93",
  focusedColor = COLORS.neutral,
  horizontalPadding = 32,
  emptyText = "No data available",
  rulesColor = "#E5E7EB",
  xAxisColor = "#E5E7EB",
  yAxisTextColor = COLORS.accent,
  showGradient = true,
  showValuesAsTopLabel = false,
  barBorderRadius = 4,
  noOfSections = 4,
  isAnimated = true,
  animationDuration = 1200,
}: Readonly<IBarChartProps>) {
  const { width: screenWidth } = useWindowDimensions();
  const [focusedBarIndex, setFocusedBarIndex] = useState<number | undefined>(
    undefined,
  );

  const safeData = rawData || [];
  const totalCount = safeData.length;

  const { containerRef, isInView, checkVisibility } = useInView<View>(
    chartHeight,
    {
      threshold: 0.8,
      enabled: isAnimated && totalCount > 0,
    },
  );

  useEffect(() => {
    setFocusedBarIndex(undefined);
  }, [rawData]);

  if (totalCount === 0) {
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

  const isDenseFilter = totalCount > 7;
  const chartWidth = screenWidth - horizontalPadding;
  const availableChartArea = Math.max(100, chartWidth - 65);

  const { barWidth, barSpacing, initialSpacing } = calculateBarLayout(
    totalCount,
    availableChartArea,
  );
  const visibleIndices = computeVisibleIndices(totalCount);

  // Map data to GiftedCharts BarChart structure
  const chartData = safeData.map((d, index) => {
    const val = Number(d.value) || 0;
    const itemFrontColor = d.frontColor || frontColor;
    const itemGradientColor = d.gradientColor || gradientColor;

    const item: Record<string, unknown> = {
      value: val,
      frontColor: itemFrontColor,
      gradientColor: itemGradientColor,
      showGradient,
      barBorderTopLeftRadius: barBorderRadius,
      barBorderTopRightRadius: barBorderRadius,
      name: d.name,
    };

    const showLabel = visibleIndices.has(index);
    const targetLabelWidth = isDenseFilter ? 40 : Math.max(48, barWidth + 8);
    const marginLeft = (barWidth - targetLabelWidth + barSpacing) / 2;
    const labelFontSize = isDenseFilter ? 8 : 9;

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
            fontSize: labelFontSize,
            color: yAxisTextColor,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {showLabel ? d.name : ""}
        </Text>
      </View>
    );

    if (showValuesAsTopLabel) {
      const formattedVal = isAmount
        ? formatAmount(val, currencySymbol)
        : String(val);
      const topLabelWidth = Math.max(52, barWidth);
      const topMarginLeft = (barWidth - topLabelWidth) / 2;

      item.topLabelComponent = () => (
        <View
          style={{
            width: topLabelWidth,
            marginLeft: topMarginLeft,
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 10,
              color: "#475569",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {formattedVal}
          </Text>
        </View>
      );
    }

    return item;
  });

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

  const tooltipPos =
    focusedBarIndex !== undefined && focusedItem
      ? calculateTooltipPosition({
          focusedBarIndex,
          focusedItem,
          barWidth,
          barSpacing,
          initialSpacing,
          availableChartArea,
          chartHeight,
          maxDataValue,
          isAmount,
          currencySymbol,
        })
      : undefined;

  return (
    <Pressable
      ref={containerRef}
      onLayout={checkVisibility}
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
      {!isAnimated || isInView ? (
        <GiftedBarChart
          data={chartData}
          width={availableChartArea}
          rulesLength={availableChartArea}
          xAxisLength={availableChartArea}
          endSpacing={initialSpacing}
          height={chartHeight - 85}
          maxValue={maxDataValue > 0 ? maxDataValue * 1.2 : undefined}
          barWidth={barWidth}
          spacing={barSpacing}
          initialSpacing={initialSpacing}
          labelWidth={48}
          disableScroll={true}
          focusedBarIndex={showValuesAsTopLabel ? undefined : focusedBarIndex}
          onPress={(_item: unknown, index: number) => {
            if (showValuesAsTopLabel) return;
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
          yAxisTextStyle={{ color: yAxisTextColor, fontSize: 8 }}
          xAxisLabelTextStyle={{
            color: yAxisTextColor,
            fontSize: 8,
            fontWeight: "600",
            textAlign: "center",
          }}
          xAxisLabelsHeight={24}
          activeOpacity={1}
          isAnimated={isAnimated}
          animationDuration={animationDuration}
          focusedBarConfig={{
            color: focusedColor,
          }}
        />
      ) : (
        <View style={{ height: chartHeight - 85 }} className="w-full" />
      )}

      {/* Popover Tooltip */}
      {!showValuesAsTopLabel && focusedItem && tooltipPos && (
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
