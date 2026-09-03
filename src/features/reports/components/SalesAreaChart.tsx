// 1. React / React Native
import React, { useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";

// 3. External libraries
import dayjs from "dayjs";
import { LineChart } from "react-native-gifted-charts";

// 4. Shared components
import { DropdownField } from "@/components/form/input";
import {
  EmptyState,
  ErrorState,
  IDropdownOption,
} from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";

// 5. Feature components/hooks
import SalesAreaChartSkeleton from "./skeletons/SalesAreaChartSkeleton";

// 6. Types
import type { ISalesTrendItem } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export type IGroupBy = "day" | "week" | "month";

export interface ISalesAreaChartProps {
  trendData?: ISalesTrendItem[] | null;
  currencySymbol: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
  groupBy?: IGroupBy;
  onGroupByChange?: (groupBy: IGroupBy) => void;
}

const GROUP_BY_OPTIONS: IDropdownOption[] = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];

const formatLabel = (label: string, groupBy: string = "day") => {
  if (!label) return "";

  if (groupBy === "week") {
    const parts = label.split("-");
    if (parts.length === 2 && !Number.isNaN(Number(parts[0]))) {
      return `W${parts[0]}`;
    }
  }

  const d = dayjs(label);
  if (d.isValid()) {
    return d.format("MMM D");
  }

  return label;
};

export interface IPointerItem {
  value: number;
  label?: string;
}

export interface IPointerLabelProps {
  readonly items: IPointerItem[];
  readonly currencySymbol: string;
}

function PointerLabel({ items, currencySymbol }: IPointerLabelProps) {
  if (!items?.length) return null;
  const tooltipText = formatAmount(items[0].value, currencySymbol);
  return (
    <View
      style={{
        backgroundColor: COLORS.accent,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 80,
        marginBottom: 6,
        shadowColor: COLORS.neutral,
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
}

export default function SalesAreaChart({
  trendData,
  currencySymbol,
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
  groupBy = "day",
  onGroupByChange,
}: Readonly<ISalesAreaChartProps>) {
  const chartData = useMemo(() => {
    if (!trendData || !Array.isArray(trendData) || trendData.length === 0)
      return [];
    return trendData.map((item: ISalesTrendItem) => ({
      value: Number(item.sales || 0),
      label: formatLabel(String(item.label || ""), groupBy),
    }));
  }, [trendData, groupBy]);

  const totalSales = useMemo(() => {
    if (!trendData || !Array.isArray(trendData) || trendData.length === 0)
      return 0;
    return trendData.reduce(
      (sum: number, item: ISalesTrendItem) => sum + Number(item.sales || 0),
      0,
    );
  }, [trendData]);

  const hasData = chartData.length > 0;
  const maxVal = hasData ? Math.max(...chartData.map((d) => d.value), 1) : 1;

  const { width: screenWidth } = useWindowDimensions();
  const chartContainerWidth = screenWidth - WP("10%");
  const chartWidth = chartContainerWidth - WP("15%");

  const initialSpacing = WP("5%");
  const endSpacing = WP("6%");

  const spacing = useMemo(() => {
    const count = chartData.length;
    if (count <= 1) return chartWidth;
    const span = chartWidth - WP("9%");
    return Math.max(30, span / (count - 1));
  }, [chartData.length, chartWidth]);

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          message="Failed to load sales trend data."
          onRetry={onRetry}
          pyClassName="py-4"
        />
      );
    }

    if (!hasData) {
      return (
        <EmptyState
          icon="show-chart"
          description="No sales trend recorded for this period."
          pyClassName="py-4"
        />
      );
    }

    return (
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
          yAxisTextStyle={{
            color: COLORS.accent,
            fontSize: getResponsiveFontSize("xs"),
          }}
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
            pointerLabelComponent: (items: IPointerItem[]) =>
              PointerLabel({ items, currencySymbol }),
          }}
        />
      </View>
    );
  };

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
      headerRight={
        onGroupByChange ? (
          <DropdownField
            dropdownOptions={GROUP_BY_OPTIONS}
            selectedValue={groupBy}
            onSelect={(val) =>
              onGroupByChange?.(
                (Array.isArray(val) ? val[0] || "" : val) as IGroupBy,
              )
            }
            className="max-w-[200px]"
            triggerClassName="justify-between bg-base-200 border border-base-200 px-3 py-1.5 rounded-lg"
          />
        ) : undefined
      }
      isLoading={isLoading}
      skeleton={<SalesAreaChartSkeleton />}
      containerClassName={containerClassName}
      bodyClassName="p-5"
    >
      {renderContent()}
    </ActionCard>
  );
}
