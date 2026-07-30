import ActionCard from "@/components/reuseable/cards/ActionCard";
import COLORS from "@/constants/colors";
import { formatAmount } from "@/utils/formatters";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface SalesByPaymentCardProps {
  salesSummary: any;
  currencySymbol: string;
  isLoading?: boolean;
  onNavigateToTab: (tab: string) => void;
  containerClassName?: string;
}

export default function SalesByPaymentCard({
  salesSummary,
  currencySymbol,
  isLoading = false,
  onNavigateToTab,
  containerClassName = "",
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
      colorClass: "bg-success",
      iconBgClass: "bg-success/15",
      iconColor: COLORS.success,
    },
    {
      key: "card",
      label: "Card Payment",
      value: card,
      percent: cardPercent,
      icon: "credit-card" as const,
      colorClass: "bg-primary",
      iconBgClass: "bg-primary/10",
      iconColor: COLORS.primary,
    },
    {
      key: "online",
      label: "Online",
      value: online,
      percent: onlinePercent,
      icon: "language" as const,
      colorClass: "bg-secondary",
      iconBgClass: "bg-secondary/10",
      iconColor: COLORS.secondary,
    },
  ];

  return (
    <ActionCard
      title="Sales by Payment Methods"
      isLoading={isLoading}
      containerClassName={containerClassName}
      bodyStyle={{ padding: WP("3.5%") }}
      actionLabel="View Full Report"
      onActionPress={() => onNavigateToTab("Daily")}
    >
      <View className="flex flex-col gap-4">
        {paymentMethods.map((item) => {
          return (
            <View key={item.key} className="gap-y-2 mb-2">
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-2.5 items-center">
                  <View className={`rounded-lg p-2 ${item.iconBgClass} items-center justify-center`}>
                    <MaterialIcons name={item.icon} size={WP("5%")} color={item.iconColor} />
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: getResponsiveFontSize("sm") }}
                      className="font-semibold text-neutral"
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="text-accent font-semibold"
                    >
                      {item.percent}% of total sales
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                  {formatAmount(item.value, currencySymbol)}
                </Text>
              </View>

              <View style={{ height: HP("1%") }} className="w-full bg-base-200 rounded-full overflow-hidden">
                <View
                  style={{ width: `${item.percent}%` }}
                  className={`h-full ${item.colorClass} rounded-full`}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ActionCard>
  );
}
