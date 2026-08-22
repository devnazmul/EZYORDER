import { DoughnutChart, type IDoughnutChartItem } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";
import { getResponsiveFontSize, WP } from "@/utils";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { IOrderSummaryData } from "../types";
import OrderStatusDistributionSkeleton from "./skeletons/OrderStatusDistributionSkeleton";

export interface IOrderStatusDistributionCardProps {
  summaryData: IOrderSummaryData | null | undefined;
  isLoading?: boolean;
  containerClassName?: string;
}

export default function OrderStatusDistributionCard({
  summaryData,
  isLoading = false,
  containerClassName = "",
}: Readonly<IOrderStatusDistributionCardProps>) {
  const totalOrders = summaryData?.total_orders ?? 0;
  const completedOrders = summaryData?.completed_orders ?? 0;
  const pendingOrders =
    summaryData?.pending?.total ?? summaryData?.pending?.pending ?? 0;
  const cancelledOrders = summaryData?.cancelled?.total ?? 0;

  const chartItems: IDoughnutChartItem[] = useMemo(() => {
    const list: IDoughnutChartItem[] = [
      {
        value: completedOrders,
        color: "#10B981", // Emerald
        label: "Completed",
        legendValue:
          totalOrders > 0
            ? `${Math.round((completedOrders / totalOrders) * 100)}%`
            : "0%",
      },
      {
        value: pendingOrders,
        color: "#3B82F6", // Blue
        label: "Pending",
        legendValue:
          totalOrders > 0
            ? `${Math.round((pendingOrders / totalOrders) * 100)}%`
            : "0%",
      },
      {
        value: cancelledOrders,
        color: "#EF4444", // Red
        label: "Cancelled",
        legendValue:
          totalOrders > 0
            ? `${Math.round((cancelledOrders / totalOrders) * 100)}%`
            : "0%",
      },
    ].filter((item) => item.value > 0);

    return list;
  }, [completedOrders, pendingOrders, cancelledOrders, totalOrders]);

  return (
    <ActionCard
      title="Order Status Distribution"
      isLoading={isLoading}
      skeleton={
        <OrderStatusDistributionSkeleton
          containerClassName={containerClassName}
        />
      }
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
    >
      <View className="items-center justify-center py-2">
        {totalOrders === 0 || chartItems.length === 0 ? (
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-accent italic text-center py-4"
          >
            No order status data for this period.
          </Text>
        ) : (
          <View className="items-center w-full py-2">
            <DoughnutChart
              items={chartItems}
              totalValue={totalOrders}
              label="Orders"
              size={WP("30%")}
              thickness={WP("4%")}
              cornerRadius={4}
              showLegend={true}
              legendPosition="right"
            />
          </View>
        )}
      </View>
    </ActionCard>
  );
}
