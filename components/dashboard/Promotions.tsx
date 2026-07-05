import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useDashboardPromotions } from "@/hooks/useDashboardQueries";
import EmptyState from "../reuseable/EmptyState";
import PromotionCard from "../PromotionCard";

export default function Promotions() {
  const { token } = useAuth();
  const { data: promotions = [], isLoading } = useDashboardPromotions(token || "");

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
    <View className="mb-6 gap-y-3">
      <Text className="text-base font-bold text-neutral">Promotions &amp; Menu</Text>
      {promotions.length === 0 ? (
        <EmptyState description="No active promotions" pyClassName="py-8" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
          {promotions.map((promo: any, idx: number) => (
            <PromotionCard key={idx} promo={promo} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
