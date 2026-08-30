// 1. React / React Native
import React from "react";
import {
  DimensionValue,
  Text,
  TextStyle,
  useWindowDimensions,
  View,
} from "react-native";

// 3. External libraries
import { LineChart as GiftedLineChart } from "react-native-gifted-charts";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { formatAmount } from "@/utils";

export interface ILineChartDataItem {
  name: string;
  value: number;
  label?: string;
  fullLabel?: string;
}

export interface ILineChartProps {
  data: ILineChartDataItem[];
  currencySymbol?: string;
  chartHeight?: number;
  isAmount?: boolean;
  color?: string;
  horizontalPadding?: number;
  emptyText?: string;
  rulesColor?: string;
  xAxisColor?: string;
  yAxisTextColor?: string;
  areaChart?: boolean;
  startFillColor?: string;
  endFillColor?: string;
  startOpacity?: number;
  endOpacity?: number;
  noOfSections?: number;
  thickness?: number;
  initialSpacing?: number;
  endSpacing?: number;
}

export default function LineChart({
  data = [],
  currencySymbol = "$",
  chartHeight = 145,
  isAmount = true,
  color = COLORS.primary,
  horizontalPadding = 32,
  emptyText = "No data available",
  rulesColor = "#E5E7EB",
  xAxisColor = "#E5E7EB",
  yAxisTextColor = "#6E6E6E",
  areaChart = true,
  startFillColor = COLORS.primary,
  endFillColor = COLORS.primary,
  startOpacity = 0.25,
  endOpacity = 0.01,
  noOfSections = 4,
  thickness = 2,
  initialSpacing = 30,
  endSpacing = 15,
}: Readonly<ILineChartProps>) {
  const { width: screenWidth } = useWindowDimensions();

  const count = data.length;
  if (count === 0) {
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

  const chartContainerWidth = Math.max(100, screenWidth - horizontalPadding);
  const availableChartArea = Math.max(100, chartContainerWidth - 65);
  const availableSpan = availableChartArea - initialSpacing - endSpacing;
  const spacing =
    count <= 1 ? availableSpan : Math.max(2, availableSpan / (count - 1));

  const maxVal = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  let visibleIndices: Set<number>;
  if (count <= 5) {
    visibleIndices = new Set(Array.from({ length: count }, (_, i) => i));
  } else {
    const maxIndex = count - 1;
    visibleIndices = new Set([
      0,
      Math.round(maxIndex * 0.25),
      Math.round(maxIndex * 0.5),
      Math.round(maxIndex * 0.75),
      maxIndex,
    ]);
  }

  const labelTextStyle: TextStyle = {
    color: yAxisTextColor,
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
    width: 48,
    marginLeft: -24,
    overflow: "visible",
  };

  const lineChartData = data.map((item, index) => ({
    value: Number(item.value) || 0,
    label: visibleIndices.has(index) ? item.name : "",
    labelWidth: 48,
    labelTextStyle,
    fullLabel: item.name,
  }));

  return (
    <View className="py-2 w-full items-center justify-center">
      <GiftedLineChart
        areaChart={areaChart}
        data={lineChartData}
        width={availableChartArea}
        rulesLength={availableChartArea}
        xAxisLength={availableChartArea}
        height={chartHeight}
        labelsExtraHeight={20}
        maxValue={maxVal > 0 ? maxVal * 1.25 : undefined}
        noOfSections={noOfSections}
        spacing={spacing}
        initialSpacing={initialSpacing}
        endSpacing={endSpacing}
        color={color}
        thickness={thickness}
        startFillColor={startFillColor}
        endFillColor={endFillColor}
        startOpacity={startOpacity}
        endOpacity={endOpacity}
        rulesColor={rulesColor}
        rulesType="solid"
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={xAxisColor}
        yAxisTextStyle={{
          color: yAxisTextColor,
          fontSize: 8,
        }}
        xAxisLabelTextStyle={labelTextStyle}
        hideDataPoints={count > 30}
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          pointerStripColor: color,
          pointerStripWidth: 1.5,
          strokeDashArray: [2, 5],
          pointerColor: color,
          radius: 4,
          pointerLabelWidth: 100,
          pointerLabelHeight: 45,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (
            items: {
              value?: number;
              label?: string;
              fullLabel?: string;
            }[],
          ) => {
            const item = items?.[0];
            if (!item) return null;
            const displayLabel = item.fullLabel || item.label || "";
            const rawVal = item.value ?? 0;
            const displayValue = isAmount
              ? formatAmount(rawVal, currencySymbol)
              : String(rawVal);

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
                  elevation: 10,
                }}
              >
                {displayLabel ? (
                  <Text
                    style={{
                      color: "#9CA3AF",
                      fontSize: 9,
                      fontWeight: "600",
                    }}
                  >
                    {displayLabel}
                  </Text>
                ) : null}
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 10,
                    fontWeight: "700",
                    marginTop: 1,
                  }}
                >
                  {displayValue}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
