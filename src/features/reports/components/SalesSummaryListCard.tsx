// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 2. Expo / Navigation
import type { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// 4. Shared components
import { LabelValueRow } from "@/components/reuseable";
import ActionCard from "@/components/reuseable/cards/ActionCard";

// 5. Feature components/hooks
import SalesSummaryListSkeleton from "./skeletons/SalesSummaryListSkeleton";

// 6. Types
import type { ISalesSummaryData } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { WP } from "@/utils/getResponsiveSizes";

export interface ISalesSummaryListCardProps {
  salesSummary?: ISalesSummaryData | null;
  currencySymbol: string;
  isLoading?: boolean;
  containerClassName?: string;
}

type IHighlightVariant = "primary" | "success" | "error";

const HIGHLIGHT_CONTAINER_CLASSES: Record<IHighlightVariant, string> = {
  primary:
    "flex-row justify-between items-center bg-primary/10 border border-primary/20 px-3 py-2.5 rounded-xl my-0.5",
  success:
    "flex-row justify-between items-center bg-success/10 border border-success/20 px-3 py-2.5 rounded-xl my-0.5",
  error:
    "flex-row justify-between items-center bg-error/10 border border-error/20 px-3 py-2.5 rounded-xl my-0.5",
};

const HIGHLIGHT_VALUE_CLASSES: Record<IHighlightVariant, string> = {
  primary: "font-extrabold text-primary",
  success: "font-extrabold text-success",
  error: "font-extrabold text-error",
};

const HIGHLIGHT_SUB_LABEL_CLASSES: Record<IHighlightVariant, string> = {
  primary: "text-primary font-normal",
  success: "text-success font-normal",
  error: "text-error font-normal",
};

interface ISummaryRowConfig {
  label: string;
  value: number;
  icon?: keyof typeof MaterialIcons.glyphMap;
  customIcon?: React.ReactNode;
  iconColor?: string;
  labelColor?: string;
  valueColor?: string;
  subLabel?: string;
  highlight?: IHighlightVariant;
}

export default function SalesSummaryListCard({
  salesSummary,
  currencySymbol,
  isLoading = false,
  containerClassName = "",
}: Readonly<ISalesSummaryListCardProps>) {
  const grossSales = Number(salesSummary?.gross_sales ?? 0);
  const discounts = Number(salesSummary?.discounts ?? 0);
  const netSales = Number(salesSummary?.net_sales ?? 0);
  const expenses = Number(salesSummary?.total_expenses ?? 0);
  const tax = Number(salesSummary?.total_tax ?? 0);
  const profit = Number(salesSummary?.profit ?? 0);

  const isProfitPositive = profit >= 0;
  const profitVariant: IHighlightVariant = isProfitPositive
    ? "success"
    : "error";
  const profitColor = isProfitPositive ? COLORS.success : COLORS.error;

  const rows: readonly ISummaryRowConfig[] = [
    {
      label: "Gross Sales",
      icon: "call-made",
      iconColor: COLORS.primary,
      value: grossSales,
    },
    {
      label: "Total Discounts",
      icon: "percent",
      iconColor: COLORS.primary,
      value: -discounts,
    },
    {
      label: "Net Sales",
      subLabel: "include tax",
      icon: "account-balance-wallet",
      iconColor: COLORS.primary,
      labelColor: COLORS.primary,
      value: netSales,
      highlight: "primary",
    },
    {
      label: "Expenses",
      icon: "receipt",
      iconColor: COLORS.primary,
      valueColor: COLORS.primary,
      value: -expenses,
    },
    {
      label: "Total Profit",
      subLabel: "include tax",
      customIcon: (
        <MaterialCommunityIcons
          name="percent-circle-outline"
          size={WP("4.5%")}
          color={profitColor}
        />
      ),
      labelColor: profitColor,
      value: profit,
      highlight: profitVariant,
    },
    {
      label: "Tax Collected",
      icon: "account-balance",
      iconColor: COLORS.primary,
      value: tax,
    },
  ];

  return (
    <ActionCard
      title="Sales Summary"
      isLoading={isLoading}
      skeleton={<SalesSummaryListSkeleton />}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Summary"
    >
      <View className="gap-y-3">
        {rows.map((row) => {
          const containerClass = row.highlight
            ? HIGHLIGHT_CONTAINER_CLASSES[row.highlight]
            : undefined;
          const labelClass = row.highlight ? "font-bold" : undefined;
          const valueClass = row.highlight
            ? HIGHLIGHT_VALUE_CLASSES[row.highlight]
            : undefined;
          const subLabelClass = row.highlight
            ? HIGHLIGHT_SUB_LABEL_CLASSES[row.highlight]
            : undefined;

          return (
            <LabelValueRow
              key={row.label}
              label={row.label}
              subLabel={row.subLabel}
              subLabelClassName={subLabelClass}
              icon={row.icon}
              customIcon={row.customIcon}
              iconColor={row.iconColor}
              labelColor={row.labelColor}
              valueColor={row.valueColor}
              value={row.value}
              valueType="currency"
              currencySymbol={currencySymbol}
              containerClassName={containerClass}
              labelClassName={labelClass}
              valueClassName={valueClass}
            />
          );
        })}
      </View>
    </ActionCard>
  );
}
