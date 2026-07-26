import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EmptyState from "../reuseable/EmptyState";
import StatusBadge from "../reuseable/StatusBadge";

interface PromotionsProps {
  promotions: any[];
  isLoading: boolean;
}

export default function Promotions({ promotions = [], isLoading }: PromotionsProps) {
  if (isLoading) {
    return (
      <View className="mb-6 gap-y-3">
        <Text className="text-base font-bold text-neutral">Promotions &amp; Menu</Text>
        <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[120px] justify-center items-center">
          <Text className="text-xs text-accent">Loading promotions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      {/* Promotions List Card */}
      <View className="bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm">
        {/* Title Header */}
        <View className="p-4 pb-3 border-b border-base-200 flex-row justify-between items-center">
          <Text className="text-sm font-semibold text-neutral capitalize">
            Promotions &amp; Menu Insights
          </Text>
        </View>
        {promotions.length === 0 ? (
          <EmptyState description="No active promotions" pyClassName="py-8" />
        ) : (
          <View className="divide-y divide-base-200">
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

        {/* Bottom Manage All Action Button */}
        <TouchableOpacity
          onPress={() => router.push("/more/discounts-and-campaigns")}
          activeOpacity={0.7}
          className="w-full py-4 items-center justify-center border-t border-base-200"
        >
          <Text className="text-xs font-semibold text-primary capitalize">Manage All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
