import ActionCard from "@/components/reuseable/cards/ActionCard";
import EmptyState from "@/components/reuseable/EmptyState";
import StatusBadge from "@/components/reuseable/StatusBadge";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

interface PromotionsProps {
  promotions: any[];
  isLoading: boolean;
}

export default function Promotions({ promotions = [], isLoading }: PromotionsProps) {
  return (
    <View className="mb-6">
      <ActionCard
        title="Promotions & Menu Insights"
        isLoading={isLoading}
        loadingText="Loading promotions..."
        actionLabel="Manage All"
        onActionPress={() => router.push("/more/discounts-and-campaigns")}
      >
        {promotions.length === 0 ? (
          <EmptyState key="empty" description="No active promotions" pyClassName="py-8" />
        ) : (
          <View key="loaded" className="divide-y divide-base-200">
            {promotions.map((promo: any, idx: number) => (
              <View key={idx} className="p-4 flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-xs font-bold text-neutral">{promo.name}</Text>
                  <Text className="text-[9px] text-accent capitalize font-semibold mt-1">
                    Code: {promo.code} • {promo.discount_type || "Discount"}
                    {promo.impact && promo.impact !== "-" ? ` • Impact: ${promo.impact}` : ""}
                  </Text>
                  {promo.alert ? (
                    <Text className="text-[9px] text-red-500/80 font-semibold mt-1 capitalize">
                      Alert: {promo.alert}
                    </Text>
                  ) : null}
                </View>

                <View className="flex-row items-center gap-4">
                  <Text className="text-xs font-bold text-neutral">{promo.usage}</Text>
                  <StatusBadge status={promo.status} />
                </View>
              </View>
            ))}
          </View>
        )}
      </ActionCard>
    </View>
  );
}
