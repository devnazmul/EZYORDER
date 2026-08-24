// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { EmptyState, ErrorState } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";
import DoughnutChart, {
  IDoughnutChartItem,
} from "@/components/reuseable/DoughnutChart";

// 5. Feature components/hooks
import SalesByPaymentSkeleton from "./skeletons/SalesByPaymentSkeleton";

// 6. Types
import type { IPaymentSummaryData } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { WP } from "@/utils/getResponsiveSizes";

export interface ISalesByPaymentCardProps {
  paymentSummary?: IPaymentSummaryData | null;
  currencySymbol: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  containerClassName?: string;
}

export default function SalesByPaymentCard({
  paymentSummary,
  currencySymbol,
  isLoading = false,
  isError = false,
  onRetry,
  containerClassName = "",
}: Readonly<ISalesByPaymentCardProps>) {
  const cash = Number(paymentSummary?.cash ?? 0);
  const card = Number(paymentSummary?.card ?? 0);
  const online = Number(paymentSummary?.online ?? 0);
  const total = Number(paymentSummary?.total ?? cash + card + online);

  const cashPercent =
    total > 0 ? Math.min(Math.round((cash / total) * 100), 100) : 0;
  const cardPercent =
    total > 0 ? Math.min(Math.round((card / total) * 100), 100) : 0;
  const onlinePercent =
    total > 0 ? Math.min(Math.round((online / total) * 100), 100) : 0;

  const paymentMethods = [
    {
      key: "cash",
      label: "Cash",
      value: cash,
      percent: cashPercent,
      color: COLORS.payment.cash,
    },
    {
      key: "card",
      label: "Card Payment",
      value: card,
      percent: cardPercent,
      color: COLORS.payment.card,
    },
    {
      key: "online",
      label: "Online",
      value: online,
      percent: onlinePercent,
      color: COLORS.payment.online,
    },
  ];

  const chartItems: IDoughnutChartItem[] = paymentMethods.map((item) => ({
    label: item.label,
    value: item.value,
    color: item.color,
    legendValue: `${item.percent}%`,
  }));

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorState
          message="Failed to load payment summary data."
          onRetry={onRetry}
          pyClassName="py-4"
        />
      );
    }

    if (total === 0) {
      return (
        <EmptyState
          icon="payments"
          description="No payment data for this period."
          pyClassName="py-4"
        />
      );
    }

    return (
      <View className="items-center justify-center py-2">
        <DoughnutChart
          items={chartItems}
          totalValue={formatAmount(total, currencySymbol)}
          label="Total"
          showLegend={true}
          legendPosition="right"
          size={WP("34%")}
          thickness={WP("5%")}
        />
      </View>
    );
  };

  return (
    <ActionCard
      title="Sales by Payment Methods"
      isLoading={isLoading}
      skeleton={<SalesByPaymentSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Report"
    >
      <View className="gap-y-4">{renderContent()}</View>
    </ActionCard>
  );
}
