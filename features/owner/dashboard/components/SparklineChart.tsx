import React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
  strokeColor?: string;
  gradientId?: string;
}

export default function SparklineChart({
  data = [],
  width = 140,
  height = 55,
  paddingTop = 4,
  paddingBottom = 4,
  strokeColor = "#DC2D2A",
  gradientId = "revenueSparklineGradient",
}: SparklineChartProps) {
  if (!data || data.length === 0) return null;

  const effectiveHeight = height - paddingTop - paddingBottom;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1 || 1)) * width;
    const y = paddingTop + effectiveHeight - ((val - minVal) / range) * effectiveHeight;
    return { x, y };
  });

  if (points.length === 1) {
    points.push({ x: width, y: points[0].y });
  }

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id={gradientId} x1={0} y1={0} x2={0} y2={height} gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={strokeColor} stopOpacity={0.8} />
          <Stop offset="40%" stopColor={strokeColor} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </LinearGradient>
      </Defs>
      <Path d={areaD} fill={`url(#${gradientId})`} />
      <Path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
