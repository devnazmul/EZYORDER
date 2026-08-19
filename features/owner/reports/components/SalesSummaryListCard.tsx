import { LabelValueRow } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";
import { COLORS } from "@/constants/colors";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";
import SalesSummaryListSkeleton from "./skeletons/SalesSummaryListSkeleton";

export interface ISalesSummaryData {
  gross_sales?: number | string;
  discounts?: number | string;
  discount?: number | string;
  refunds?: number | string;
  net_sales?: number | string;
  total_expenses?: number | string;
  expenses?: number | string;
  total_tax?: number | string;
  tax?: number | string;
  tax_collected?: number | string;
  profit?: number | string;
}

export interface ISalesSummaryListCardProps {
  salesSummary?: ISalesSummaryData | null;
  currencySymbol: string;
  isLoading?: boolean;
  containerClassName?: string;
}

export default function SalesSummaryListCard({
  salesSummary,
  currencySymbol,
  isLoading = false,
  containerClassName = "",
}: Readonly<ISalesSummaryListCardProps>) {
  const grossSales = Number(salesSummary?.gross_sales ?? 0);
  const discounts = Number(
    salesSummary?.discounts ?? salesSummary?.discount ?? 0,
  );
  const returns = Number(salesSummary?.refunds ?? 0);
  const netSales = Number(salesSummary?.net_sales ?? 0);
  const expenses = Number(
    salesSummary?.total_expenses ?? salesSummary?.expenses ?? 0,
  );
  const tax = Number(
    salesSummary?.total_tax ??
      salesSummary?.tax ??
      salesSummary?.tax_collected ??
      0,
  );
  const profit = Number(salesSummary?.profit ?? 0);

  return (
    <ActionCard
      title="Sales Summary"
      isLoading={isLoading}
      skeleton={<SalesSummaryListSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Summary"
    >
      <View className="gap-y-4">
        {/* Gross Sales */}
        <LabelValueRow
          label="Gross Sales"
          icon="trending-up"
          iconColor={COLORS.primary}
          value={grossSales}
          valueType="currency"
          currencySymbol={currencySymbol}
        />

        {/* Total Discounts */}
        <LabelValueRow
          label="Total Discounts"
          icon="local-offer"
          iconColor={COLORS.primary}
          value={-discounts}
          valueType="currency"
          currencySymbol={currencySymbol}
        />

        {/* Returns */}
        <LabelValueRow
          label="Returns"
          icon="undo"
          iconColor={COLORS.primary}
          value={-returns}
          valueType="currency"
          currencySymbol={currencySymbol}
        />

        {/* Net Sales */}
        <LabelValueRow
          label="Net Sales"
          icon="account-balance-wallet"
          iconColor={COLORS.primary}
          value={netSales}
          valueType="currency"
          currencySymbol={currencySymbol}
        />

        {/* Expenses */}
        <LabelValueRow
          label="Expenses"
          icon="receipt"
          iconColor={COLORS.primary}
          value={-expenses}
          valueType="currency"
          currencySymbol={currencySymbol}
        />

        {/* Tax Collected */}
        <LabelValueRow
          label="Tax Collected"
          icon="account-balance"
          iconColor={COLORS.primary}
          value={tax}
          valueType="currency"
          currencySymbol={currencySymbol}
        />

        {/* Total Profit */}
        <LabelValueRow
          label="Total Profit (Est.)"
          icon="attach-money"
          iconColor={COLORS.primary}
          value={profit}
          valueType="currency"
          currencySymbol={currencySymbol}
        />
      </View>
    </ActionCard>
  );
}
