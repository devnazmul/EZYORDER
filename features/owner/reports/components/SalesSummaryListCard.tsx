import ActionCard from "@/components/reuseable/cards/ActionCard";
import COLORS from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import SalesSummaryListSkeleton from "./skeletons/SalesSummaryListSkeleton";

interface SalesSummaryListCardProps {
  salesSummary: any;
  currencySymbol: string;
  isLoading?: boolean;
  onNavigateToTab: (tab: string) => void;
  containerClassName?: string;
}

export default function SalesSummaryListCard({
  salesSummary,
  currencySymbol,
  isLoading = false,
  onNavigateToTab,
  containerClassName = "",
}: SalesSummaryListCardProps) {
  const grossSales = Number(salesSummary?.gross_sales ?? 0);
  const discounts = Number(salesSummary?.discounts ?? salesSummary?.discount ?? 0);
  const returns = Number(salesSummary?.refunds ?? 0);
  const netSales = Number(salesSummary?.net_sales ?? 0);
  const tax = Number(salesSummary?.tax ?? salesSummary?.tax_collected ?? 0);
  const profit = Number(salesSummary?.profit ?? 0);

  return (
    <ActionCard
      title="Sales Summary"
      isLoading={isLoading}
      skeleton={<SalesSummaryListSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Summary"
      onActionPress={() => onNavigateToTab("Daily")}
    >
      <View className="gap-y-4">
        {/* Gross Sales */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="trending-up" size={WP("4.5%")} color={COLORS.primary} />
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              Gross Sales
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm"), color: COLORS.neutral }}
            className="font-semibold"
          >
            {formatAmount(grossSales, currencySymbol)}
          </Text>
        </View>

        {/* Total Discounts */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="local-offer" size={WP("4.5%")} color={COLORS.primary} />
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              Total Discounts
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm"), color: COLORS.primary }}
            className="font-semibold"
          >
            -{formatAmount(discounts, currencySymbol)}
          </Text>
        </View>

        {/* Returns */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="undo" size={WP("4.5%")} color={COLORS.primary} />
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              Returns
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm"), color: COLORS.primary }}
            className="font-semibold"
          >
            -{formatAmount(returns, currencySymbol)}
          </Text>
        </View>

        {/* Net Sales */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="account-balance-wallet" size={WP("4.5%")} color={COLORS.primary} />
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              Net Sales
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm"), color: COLORS.neutral }}
            className="font-semibold"
          >
            {formatAmount(netSales, currencySymbol)}
          </Text>
        </View>

        {/* Tax Collected */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="account-balance" size={WP("4.5%")} color={COLORS.primary} />
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              Tax Collected
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm"), color: COLORS.neutral }}
            className="font-semibold"
          >
            {formatAmount(tax, currencySymbol)}
          </Text>
        </View>

        {/* Total Profit */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="attach-money" size={WP("4.5%")} color={COLORS.primary} />
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral">
              Total Profit (Est.)
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("sm"), color: COLORS.neutral }}
            className="font-semibold"
          >
            {formatAmount(profit, currencySymbol)}
          </Text>
        </View>
      </View>
    </ActionCard>
  );
}
