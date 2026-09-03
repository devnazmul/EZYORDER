import Badge from "@/components/reuseable/Badge";
import ActionCard from "@/components/reuseable/cards/ActionCard";
import EmptyState from "@/components/reuseable/EmptyState";
import StatusBadge from "@/components/reuseable/StatusBadge";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import PromotionsSkeleton from "./skeletons/PromotionsSkeleton";

interface PromotionsProps {
  promotions: any[];
  isLoading: boolean;
}

export default function Promotions({ promotions = [], isLoading }: PromotionsProps) {
  return (
    <ActionCard
      title="Promotions & Menu Insights"
      isLoading={isLoading}
      skeleton={<PromotionsSkeleton />}
      actionLabel="Manage All"
      onActionPress={() => router.push("/more/discounts-and-campaigns")}
    >
      {promotions.length === 0 ? (
        <EmptyState key="empty" description="No active promotions" pyClassName="py-8" />
      ) : (
        <View key="loaded">
          {promotions.map((promo: any, idx: number) => {
            const isLast = idx === promotions.length - 1;
            return (
              <View
                key={idx}
                style={{ padding: WP("4%") }}
                className={`flex-row items-center justify-between ${!isLast ? "border-b border-base-100" : ""}`}
              >
                <View className="flex-1 mr-4">
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    {promo.name}
                  </Text>
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="text-accent capitalize font-semibold mt-1 opacity-80"
                  >
                    Code: {promo.code} • {promo.discount_type || "Discount"}
                    {promo.impact && promo.impact !== "-" ? ` • Impact: ${promo.impact}` : ""}
                  </Text>
                  {promo.alert ? (
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="text-red-500/80 font-semibold mt-1 capitalize"
                    >
                      Alert: {promo.alert}
                    </Text>
                  ) : null}
                </View>

                <View className="items-end gap-1.5">
                  {promo.usage ? (
                    <Badge
                      text={promo.usage}
                      containerClassName="bg-info/10 border border-info/30"
                      textClassName="text-info"
                    />
                  ) : null}
                  <StatusBadge status={promo.status?.toLowerCase()} />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ActionCard>
  );
}
