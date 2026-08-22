import {
  ActionCard,
  BarChart,
  type IBarChartDataItem,
} from "@/components/reuseable";
import { formatAmount, getResponsiveFontSize, WP } from "@/utils";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { IOrderSummaryData } from "../types";
import OrderSalesMetricsSkeleton from "./skeletons/OrderSalesMetricsSkeleton";

export interface IOrderSalesMetricsCardProps {
  summaryData: IOrderSummaryData | null | undefined;
  currencySymbol: string;
  isLoading?: boolean;
  containerClassName?: string;
}

export default function OrderSalesMetricsCard({
  summaryData,
  currencySymbol,
  isLoading = false,
  containerClassName = "",
}: Readonly<IOrderSalesMetricsCardProps>) {
  const grossSales = summaryData?.sales?.completed_gross_sales ?? 0;
  const netSales = summaryData?.sales?.completed_net_sales ?? 0;
  const discounts = summaryData?.sales?.completed_discounts ?? 0;

  const barData: IBarChartDataItem[] = useMemo(() => {
    return [
      {
        name: "Gross",
        value: grossSales,
        frontColor: "#6366F1", // Indigo
        gradientColor: "#A5B4FC",
      },
      {
        name: "Net",
        value: netSales,
        frontColor: "#3B82F6", // Blue
        gradientColor: "#93C5FD",
      },
      {
        name: "Discount",
        value: discounts,
        frontColor: "#F97316", // Orange
        gradientColor: "#FDBA74",
      },
    ];
  }, [grossSales, netSales, discounts]);

  const hasSalesData = grossSales > 0 || netSales > 0 || discounts > 0;

  return (
    <ActionCard
      title="Sales Overview"
      isLoading={isLoading}
      skeleton={
        <OrderSalesMetricsSkeleton containerClassName={containerClassName} />
      }
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
    >
      <View className="py-2">
        {!hasSalesData ? (
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-accent italic text-center py-4"
          >
            No sales metrics available for this period.
          </Text>
        ) : (
          <View className="items-center w-full">
            <BarChart
              data={barData}
              currencySymbol={currencySymbol}
              chartHeight={180}
              isAmount={true}
              showGradient={true}
              noOfSections={4}
            />

            {/* Metrics Breakdown Legend */}
            <View className="flex-row justify-around w-full mt-4 pt-3 border-t border-base-200">
              <View className="items-center">
                <Text
                  style={{ fontSize: 10 }}
                  className="text-accent font-medium uppercase"
                >
                  Gross Sales
                </Text>
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className="font-bold text-[#6366F1]"
                >
                  {formatAmount(grossSales, currencySymbol)}
                </Text>
              </View>

              <View className="items-center">
                <Text
                  style={{ fontSize: 10 }}
                  className="text-accent font-medium uppercase"
                >
                  Net Sales
                </Text>
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className="font-bold text-[#3B82F6]"
                >
                  {formatAmount(netSales, currencySymbol)}
                </Text>
              </View>

              <View className="items-center">
                <Text
                  style={{ fontSize: 10 }}
                  className="text-accent font-medium uppercase"
                >
                  Discounts
                </Text>
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className="font-bold text-[#F97316]"
                >
                  {formatAmount(discounts, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ActionCard>
  );
}
