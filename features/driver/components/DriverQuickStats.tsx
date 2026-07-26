import { formatAmount } from "@/utils/formatAmount";
import React from "react";
import { Text, View } from "react-native";
import { formatRating } from "../utils/formatRating";
import KpiCard from "@/components/reuseable/dashboard/KpiCard";

interface DriverQuickStatsProps {
  isLoadingStats: boolean;
  stats: any;
  currencySymbol?: string;
  distanceUnit?: string;
}

const DriverQuickStats: React.FC<DriverQuickStatsProps> = ({
  isLoadingStats,
  stats,
  currencySymbol,
  distanceUnit,
}: DriverQuickStatsProps) => {
  const earningTrend: string = stats?.earnings_trend?.split(" ").at(0) + " vs Yesterday" || "";
  return (
    <View className="bg-base-300 p-4 pb-1 rounded-3xl flex-1">
      <Text className="mb-4 font-bold capitalize opacity-80">Quick Stats</Text>
      <View className="flex-col gap-2 mb-4">
        {/* First row: 2 columns */}
        <View className="flex-row gap-2 h-[230px]">
          {/* Column 1: Earnings */}
          <View className="flex-1">
            <KpiCard
              title="Earnings"
              value={formatAmount(stats?.today_earnings ?? 0, currencySymbol)}
              valueClassName="text-3xl"
              trendText={earningTrend?.toLowerCase()}
              variant="dark"
              trend={earningTrend.includes("+0") ? "neutral" : earningTrend.includes("+") ? "up" : "down"}
              icon="currency-pound"
              gradientColors={["#0B1220", "#1E293B"]}
              loading={isLoadingStats}
            />
          </View>

          {/* Column 2: Distance & Deliveries */}
          <View className="flex-1 flex-col gap-2">
            <View className="flex-1">
              <KpiCard
                title="Distance"
                value={`${(stats?.total_distance ?? 0).toFixed(1)} ${distanceUnit}`}
                icon="alt-route"
                iconColor="#2563EB"
                gradientColors={["#EFF6FF", "#DBEAFE"]}
                loading={isLoadingStats}
              />
            </View>
            <View className="flex-1">
              <KpiCard
                title="Deliveries"
                value={String(stats?.deliveries_count ?? 0)}
                icon="check-circle-outline"
                iconColor="#7C3AED"
                gradientColors={["#FAF5FF", "#E9D5FF"]}
                loading={isLoadingStats}
              />
            </View>
          </View>
        </View>

        {/* Second row: Rating */}
        <KpiCard
          title="Rating"
          value={formatRating(stats?.avg_rating)}
          icon="star-border"
          iconColor="#D97706"
          gradientColors={["#FFFBEB", "#FEF3C7"]}
          loading={isLoadingStats}
        />
      </View>
    </View>
  );
};

DriverQuickStats.displayName = "Driver Quick Stats";
export default DriverQuickStats;
