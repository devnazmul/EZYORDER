// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { DoughnutChart, EmptyState } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";

// 5. Feature components/services
import { OrderReportsService } from "../services/orderReportsService";
import OrderStatusDistributionSkeleton from "./skeletons/OrderStatusDistributionSkeleton";

// 6. Types
import { IOrderSummaryData } from "../types";

// 7. Constants/utils
import { WP } from "@/utils";

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
  const { totalOrders, chartItems, isEmpty } =
    OrderReportsService.getOrderStatusDistributionChartData(summaryData);

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
        {isEmpty ? (
          <EmptyState
            icon="pie-chart"
            description="No order status data for this period."
            pyClassName="py-4"
          />
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
