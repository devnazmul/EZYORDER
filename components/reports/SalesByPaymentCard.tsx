import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesByPaymentCardProps {
  salesSummary: any;
  currencySymbol: string;
  isLoading?: boolean;
  onNavigateToTab: (tab: string) => void;
}

export default function SalesByPaymentCard({
  salesSummary,
  currencySymbol,
  isLoading = false,
  onNavigateToTab,
}: SalesByPaymentCardProps) {

  const cash = Number(salesSummary?.payment_summary?.cash ?? 0);
  const card = Number(salesSummary?.payment_summary?.card ?? 0);
  const online = Number(salesSummary?.payment_summary?.online ?? 0);
  const total = cash + card + online;

  const cashPercent = total > 0 ? Math.min(Math.round((cash / total) * 100), 100) : 0;
  const cardPercent = total > 0 ? Math.min(Math.round((card / total) * 100), 100) : 0;
  const onlinePercent = total > 0 ? Math.min(Math.round((online / total) * 100), 100) : 0;

  const paymentMethods = [
    {
      key: "cash",
      label: "Cash",
      value: cash,
      percent: cashPercent,
      icon: "payments" as const,
      colorClass: "bg-indigo-500",
      iconBgClass: "bg-indigo-500/10",
      iconColor: "#6366f1",
    },
    {
      key: "card",
      label: "Card Payment",
      value: card,
      percent: cardPercent,
      icon: "credit-card" as const,
      colorClass: "bg-blue-500",
      iconBgClass: "bg-blue-500/10",
      iconColor: "#3b82f6",
    },
    {
      key: "online",
      label: "Online",
      value: online,
      percent: onlinePercent,
      icon: "language" as const,
      colorClass: "bg-emerald-500",
      iconBgClass: "bg-emerald-500/10",
      iconColor: "#10b981",
    },
  ];

  return (
    <View className="bg-base-300 border border-base-200 rounded-lg p-5 mb-6 shadow-sm">
      <Text className="text-md font-bold text-neutral mb-5">Sales by Payment Methods</Text>

      <View className="gap-y-4">
        {paymentMethods.map((item) => {
          return (
            <View key={item.key} className="gap-y-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2.5 items-center">
                  <View className={`w-8 h-8 rounded-full ${item.iconBgClass} items-center justify-center`}>
                    <MaterialIcons name={item.icon} size={16} color={item.iconColor} />
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-neutral">{item.label}</Text>
                    <Text className="text-[10px] text-accent font-semibold">{item.percent}% of total sales</Text>
                  </View>
                </View>
                <Text className="text-xs font-extrabold text-neutral">
                  {formatAmount(item.value, currencySymbol)}
                </Text>
              </View>

              <View className="h-2 w-full bg-base-200 rounded-full overflow-hidden">
                <View style={{ width: `${item.percent}%` }} className={`h-full ${item.colorClass} rounded-full`} />
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => onNavigateToTab("Daily")}
        className="mt-5 pt-3 border-t border-base-200 flex-row justify-end items-center"
      >
        <Text className="text-xs font-bold text-primary mr-1">View full report</Text>
        <MaterialIcons name="arrow-forward" size={14} color="#DC2D2A" />
      </TouchableOpacity>
    </View>
  );
}
