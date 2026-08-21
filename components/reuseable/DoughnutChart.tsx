import { COLORS } from "@/constants";
import { getResponsiveFontSize, WP } from "@/utils";
import React, { useState } from "react";
import {
  StyleProp,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

export type IDoughnutChartItem = {
  label: string;
  value: number;
  color?: string | string[];
  colors?: string[];
  legendValue?: string | number;
};

export type IDoughnutChartProps = {
  items: IDoughnutChartItem[];
  totalValue: number | string;
  label?: string;
  size?: number;
  thickness?: number;
  cornerRadius?: number;
  colors?: string[];
  showLegend?: boolean;
  legendPosition?: "left" | "right" | "bottom";
  style?: StyleProp<ViewStyle>;
  className?: string;
  showCenterText?: boolean;
};

const getGradientColors = (color: string): { start: string; end: string } => ({
  start: color,
  end: color,
});

const polar = (
  cx: number,
  cy: number,
  r: number,
  angle: number,
): { x: number; y: number } => ({
  x: cx + r * Math.cos(angle),
  y: cy + r * Math.sin(angle),
});

const DoughnutChart: React.FC<IDoughnutChartProps> = ({
  items,
  totalValue,
  label = "Total",
  size = WP("28%"),
  thickness = WP("4%"),
  cornerRadius = 4,
  colors,
  showLegend = false,
  legendPosition = "right",
  style,
  className,
  showCenterText = true,
}): React.JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const center = size / 2;
  const rOut = size / 2 - 2;
  const rIn = rOut - thickness;

  // Keep corner radius safe based on ring thickness
  const effectiveCornerRadius = Math.min(cornerRadius, thickness / 2 - 0.5);

  const getAnnulusSectorPath = (
    cx: number,
    cy: number,
    rIn: number,
    rOut: number,
    startAngle: number,
    endAngle: number,
    cr: number = 0,
  ): string => {
    if (cr <= 0) {
      const x1_out = cx + rOut * Math.cos(startAngle);
      const y1_out = cy + rOut * Math.sin(startAngle);
      const x2_out = cx + rOut * Math.cos(endAngle);
      const y2_out = cy + rOut * Math.sin(endAngle);

      const x1_in = cx + rIn * Math.cos(startAngle);
      const y1_in = cy + rIn * Math.sin(startAngle);
      const x2_in = cx + rIn * Math.cos(endAngle);
      const y2_in = cy + rIn * Math.sin(endAngle);

      const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

      return `M ${x1_out} ${y1_out} A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in} Z`;
    }

    const dOut = cr / rOut;
    const dIn = cr / rIn;

    const oStart = polar(cx, cy, rOut, startAngle + dOut);
    const oEnd = polar(cx, cy, rOut, endAngle - dOut);
    const iEnd = polar(cx, cy, rIn, endAngle - dIn);
    const iStart = polar(cx, cy, rIn, startAngle + dIn);

    const outerEdgeEnd = polar(cx, cy, rOut - cr, endAngle);
    const innerEdgeEnd = polar(cx, cy, rIn + cr, endAngle);
    const innerEdgeStart = polar(cx, cy, rIn + cr, startAngle);
    const outerEdgeStart = polar(cx, cy, rOut - cr, startAngle);

    const largeArc = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `M ${oStart.x} ${oStart.y}
      A ${rOut} ${rOut} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}
      A ${cr} ${cr} 0 0 1 ${outerEdgeEnd.x} ${outerEdgeEnd.y}
      L ${innerEdgeEnd.x} ${innerEdgeEnd.y}
      A ${cr} ${cr} 0 0 1 ${iEnd.x} ${iEnd.y}
      A ${rIn} ${rIn} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}
      A ${cr} ${cr} 0 0 1 ${innerEdgeStart.x} ${innerEdgeStart.y}
      L ${outerEdgeStart.x} ${outerEdgeStart.y}
      A ${cr} ${cr} 0 0 1 ${oStart.x} ${oStart.y}
      Z`;
  };

  const getItemColors = (item: IDoughnutChartItem, index: number): string[] => {
    if (colors?.[index]) {
      return [colors[index]];
    }
    if (item.colors && item.colors.length > 0) {
      return item.colors;
    }
    if (Array.isArray(item.color)) {
      return item.color;
    }
    if (typeof item.color === "string") {
      return [item.color];
    }
    return [COLORS.secondary];
  };

  const renderPaths = (): React.JSX.Element => {
    const activeItems = items.filter((item) => item.value > 0);
    const sum = activeItems.reduce((acc, item) => acc + item.value, 0);

    const renderDefs = (): React.JSX.Element => (
      <Defs>
        {activeItems.map((item, index) => {
          const itemColors = getItemColors(item, index);
          const gradId = `grad-${item.label.replace(/\s+/g, "-")}`;
          return (
            <LinearGradient
              key={gradId}
              id={gradId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {itemColors.length === 1
                ? (() => {
                    const { start, end } = getGradientColors(itemColors[0]);
                    return [
                      <Stop key="start" offset="0%" stopColor={start} />,
                      <Stop key="end" offset="100%" stopColor={end} />,
                    ];
                  })()
                : itemColors.map((color, colorIdx) => (
                    <Stop
                      key={color}
                      offset={`${(colorIdx / (itemColors.length - 1)) * 100}%`}
                      stopColor={color}
                    />
                  ))}
            </LinearGradient>
          );
        })}
      </Defs>
    );

    if (sum === 0) {
      return (
        <Path
          d={getAnnulusSectorPath(
            center,
            center,
            rIn,
            rOut,
            0,
            2 * Math.PI - 0.01,
            0,
          )}
          fill="#E9EBEB"
          stroke="#E9EBEB"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      );
    }

    if (activeItems.length === 1) {
      const item = activeItems[0];
      const itemColors = getItemColors(item, 0);
      const gradId = `grad-${item.label.replace(/\s+/g, "-")}`;
      const originalIndex = items.findIndex((i) => i.label === item.label);
      const isSelected =
        selectedIndex === null || selectedIndex === originalIndex;
      const opacity = isSelected ? 1.0 : 0.5;
      return (
        <>
          <Defs>
            <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {itemColors.length === 1
                ? (() => {
                    const { start, end } = getGradientColors(itemColors[0]);
                    return [
                      <Stop key="start" offset="0%" stopColor={start} />,
                      <Stop key="end" offset="100%" stopColor={end} />,
                    ];
                  })()
                : itemColors.map((color, colorIdx) => (
                    <Stop
                      key={color}
                      offset={`${(colorIdx / (itemColors.length - 1)) * 100}%`}
                      stopColor={color}
                    />
                  ))}
            </LinearGradient>
          </Defs>
          <Path
            d={getAnnulusSectorPath(
              center,
              center,
              rIn,
              rOut,
              0,
              2 * Math.PI - 0.01,
              0,
            )}
            fill={`url(#${gradId})`}
            opacity={opacity}
            onPress={() => setSelectedIndex(originalIndex)}
          />
        </>
      );
    }

    const gap = 0.05;
    const totalGap = activeItems.length * gap;
    const remainingAngle = 2 * Math.PI - totalGap;

    let currentAngle = -Math.PI / 2;
    return (
      <>
        {renderDefs()}
        {activeItems.map((item, index) => {
          const angle = (item.value / sum) * remainingAngle;
          const startAngle = currentAngle + gap / 2;
          const endAngle = startAngle + angle;
          currentAngle = endAngle + gap / 2;
          const gradId = `grad-${item.label.replace(/\s+/g, "-")}`;

          const originalIndex = items.findIndex((i) => i.label === item.label);
          const isSelected =
            selectedIndex === null || selectedIndex === originalIndex;
          const opacity = isSelected ? 1.0 : 0.5;

          return (
            <Path
              key={item.label}
              d={getAnnulusSectorPath(
                center,
                center,
                rIn,
                rOut,
                startAngle,
                endAngle,
                effectiveCornerRadius,
              )}
              fill={`url(#${gradId})`}
              opacity={opacity}
              onPress={() => setSelectedIndex(originalIndex)}
            />
          );
        })}
      </>
    );
  };

  const get90PercentColor = (color: string): string => {
    if (color.startsWith("#")) {
      let hex = color;
      if (hex.length === 4) {
        hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      }
      return hex + "E5"; // 90% opacity in hex
    }
    return color;
  };

  const renderLegend = (): React.JSX.Element | null => {
    if (!showLegend) return null;

    let legendContainerClass = "w-full flex-col gap-y-2.5 mt-4";
    if (legendPosition === "right") {
      legendContainerClass = "flex-1 flex-col gap-y-2.5 ml-4";
    } else if (legendPosition === "left") {
      legendContainerClass = "flex-1 flex-col gap-y-2.5 mr-2 pl-4";
    }

    return (
      <View
        className={legendContainerClass}
        style={
          legendPosition === "right" || legendPosition === "left"
            ? { maxWidth: WP("50%") }
            : undefined
        }
      >
        {items.map((item, index) => {
          const itemColors = getItemColors(item, index);
          const legendBaseColor =
            typeof item.color === "string"
              ? item.color
              : itemColors[0] || COLORS.secondary;

          const isSelected = selectedIndex === null || selectedIndex === index;
          const opacity = isSelected ? 1.0 : 0.5;

          return (
            <TouchableWithoutFeedback
              key={`${item.label}-${index}`}
              onPress={() => setSelectedIndex(index)}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  opacity,
                }}
              >
                {item.legendValue !== undefined && item.legendValue !== null ? (
                  <View
                    style={{
                      backgroundColor: get90PercentColor(legendBaseColor),
                      paddingHorizontal: WP("2%"),
                      paddingVertical: WP("0.5%"),
                      borderRadius: 8,
                      marginRight: WP("2%"),
                      minWidth: WP("12%"),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: getResponsiveFontSize("xs") - 1,
                        fontWeight: "bold",
                        color: "#ffffff",
                      }}
                      className="font-bold"
                    >
                      {item.legendValue}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      width: WP("2.5%"),
                      height: WP("2.5%"),
                      borderRadius: WP("1.25%"),
                      backgroundColor: legendBaseColor,
                      marginRight: WP("2%"),
                    }}
                  />
                )}
                <Text className="flex-1">
                  <Text
                    style={{ fontSize: getResponsiveFontSize("sm") }}
                    className="text-neutral font-bold"
                  >
                    {item.value}
                  </Text>
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="text-neutral font-semibold capitalize"
                  >
                    {" "}
                    {item.label}
                  </Text>
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    );
  };

  const containerClasses = [
    showLegend && (legendPosition === "right" || legendPosition === "left")
      ? "flex-row items-center justify-between"
      : "flex-col items-center",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle = [!showLegend && { width: size, height: size }, style];

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedIndex(null)}>
      <View className={containerClasses} style={containerStyle}>
        {legendPosition === "left" && renderLegend()}
        <View
          className="items-center justify-center relative"
          style={{ width: size, height: size }}
        >
          <Svg width={size} height={size}>
            {renderPaths()}
          </Svg>
          {showCenterText && (
            <View className="absolute items-center justify-center">
              <Text
                style={{ fontSize: getResponsiveFontSize("xl") }}
                className="text-neutral font-bold"
              >
                {totalValue}
              </Text>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-neutral font-semibold capitalize tracking-wide"
              >
                {label}
              </Text>
            </View>
          )}
        </View>
        {legendPosition !== "left" && renderLegend()}
      </View>
    </TouchableWithoutFeedback>
  );
};

DoughnutChart.displayName = "DoughnutChart";
export default DoughnutChart;
