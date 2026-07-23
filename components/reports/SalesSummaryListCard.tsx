import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesSummaryListCardProps {
  salesSummary: any;
  currencySymbol: string;
  isLoading?: boolean;
  onNavigateToTab: (tab: string) => void;
}

export default function SalesSummaryListCard({
  salesSummary,
  currencySymbol,
  isLoading = false,
  onNavigateToTab,
}: SalesSummaryListCardProps) {

  const grossSales = Number(salesSummary?.gross_sales ?? 0);
  const discounts = Number(salesSummary?.discounts ?? salesSummary?.discount ?? 0);
  const returns = Number(salesSummary?.refunds ?? 0);
  const netSales = Number(salesSummary?.net_sales ?? 0);
  const tax = Number(salesSummary?.tax ?? salesSummary?.tax_collected ?? 0);
  const profit = Number(salesSummary?.profit ?? 0);

  return (
    <View className="bg-base-300 border border-base-200 rounded-lg p-5 mb-6 shadow-sm">
      <Text className="text-md font-bold text-neutral mb-5">Sales Summary</Text>

      <View className="gap-y-4">
        {/* Gross Sales */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="trending-up" size={18} color="#6E6E6E" />
            <Text className="text-xs font-bold text-neutral">Gross Sales</Text>
          </View>
          <Text className="text-xs font-bold text-neutral">
            {formatAmount(grossSales, currencySymbol)}
          </Text>
        </View>

        {/* Total Discounts */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="local-offer" size={18} color="#6E6E6E" />
            <Text className="text-xs font-bold text-neutral">Total Discounts</Text>
          </View>
          <Text className="text-xs font-bold text-error">
            -{formatAmount(discounts, currencySymbol)}
          </Text>
        </View>

        {/* Returns */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="undo" size={18} color="#6E6E6E" />
            <Text className="text-xs font-bold text-neutral">Returns</Text>
          </View>
          <Text className="text-xs font-bold text-error">
            -{formatAmount(returns, currencySymbol)}
          </Text>
        </View>

        {/* Net Sales */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="account-balance-wallet" size={18} color="#6E6E6E" />
            <Text className="text-xs font-bold text-neutral">Net Sales</Text>
          </View>
          <Text className="text-xs font-bold text-neutral">
            {formatAmount(netSales, currencySymbol)}
          </Text>
        </View>

        {/* Tax Collected */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="account-balance" size={18} color="#6E6E6E" />
            <Text className="text-xs font-bold text-neutral">Tax Collected</Text>
          </View>
          <Text className="text-xs font-bold text-neutral">
            {formatAmount(tax, currencySymbol)}
          </Text>
        </View>

        {/* Total Profit */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <MaterialIcons name="attach-money" size={18} color="#6E6E6E" />
            <Text className="text-xs font-bold text-neutral">Total Profit (Est.)</Text>
          </View>
          <Text className="text-xs font-bold text-success">
            {formatAmount(profit, currencySymbol)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onNavigateToTab("Daily")}
        className="mt-5 pt-3 border-t border-base-200 flex-row justify-end items-center"
      >
        <Text className="text-xs font-bold text-primary w-[150px] text-right pr-2">View full summary</Text>
        <MaterialIcons name="arrow-forward" size={14} color="#DC2D2A" />
      </TouchableOpacity>
    </View>
  );
}
