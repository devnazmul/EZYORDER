import KpiCard from "@/components/reuseable/dashboard/KpiCard";
import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { useResponsiveScreen, WP } from "@/utils/getResponsiveSizes";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import SparklineChart from "../../components/SparklineChart";

interface KpiMetricsProps {
  filterBy: string;
  metrics: any;
  revenueChart?: any[];
  isLoading: boolean;
}

export default function KpiMetrics({
  filterBy,
  metrics = {},
  revenueChart = [],
  isLoading,
}: KpiMetricsProps) {
  const { settings } = useData();
  const { isLandscape } = useResponsiveScreen();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const isNegativeTrend = useMemo(() => {
    const trend = metrics?.revenueTrend || "";
    return trend.includes("-");
  }, [metrics?.revenueTrend]);

  const sparklineData = useMemo(() => {
    if (!revenueChart || !Array.isArray(revenueChart)) return [];
    return revenueChart.map((d: any) => parseFloat(d.value) || 0);
  }, [revenueChart]);

  if (isLoading) {
    return (
      <View key="loading" className="flex-1 gap-y-3">
        <KpiCard title="Revenue" value="--" loading={true} />
        <View className="flex-row gap-2 flex-1">
          <View className="flex-1">
            <KpiCard title="Active Orders" value="--" loading={true} />
          </View>
          <View className="flex-1">
            <KpiCard title="Scheduled" value="--" loading={true} />
          </View>
        </View>
        <View className="flex-row gap-2 flex-1">
          <View className="flex-1">
            <KpiCard title="Today's Orders" value="--" loading={true} />
          </View>
          <View className="flex-1">
            <KpiCard title="Average Order" value="--" loading={true} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View key="loaded" className="flex-1 gap-y-2">
      {/* Revenue Dark Hero Card (Row 1 - Full Width) */}
      <View className="flex-1">
        <KpiCard
          variant="dark"
          minHeight={140}
          title={filterBy === "this_week" ? "This Week Revenue" : "This Month Revenue"}
          value={formatAmount(metrics?.revenue || "0", currencySymbol)}
          icon="currency-pound"
          iconColor="#FFFFFF"
          iconBgColor="#10B981"
          gradientColors={["#111827", "#0F172A"]}
          trend={isNegativeTrend ? "down" : "up"}
          trendText={
            metrics?.revenueTrend
              ? `${metrics.revenueTrend} vs ${filterBy === "this_week" ? "Last Week" : "Last Month"}`
              : undefined
          }
          rightElement={
            sparklineData.length > 0 ? (
              <SparklineChart
                data={sparklineData}
                width={isLandscape ? WP("22%") : WP("38%")}
                height={80}
                paddingBottom={14}
                strokeColor={isNegativeTrend ? "#DC2D2A" : "#10B981"}
                gradientId={isNegativeTrend ? "revenueSparklineNeg" : "revenueSparklinePos"}
              />
            ) : null
          }
          onPress={() =>
            router.push({
              pathname: "/orders/all-orders",
              params: {
                tab: "eat_in,delivery,take_away,walk_in",
                filterBy,
                status: "completed",
                date_filter: filterBy,
              },
            })
          }
        />
      </View>

      {/* Row 2 - 2 Columns (Active Orders & Scheduled Orders) */}
      <View className="flex-row flex-1 gap-2">
        <View className="flex-1">
          <KpiCard
            variant="dark"
            title="Active Orders"
            value={String(metrics?.activeOrders || 0)}

            icon="schedule"
            iconColor="#FFFFFF"
            iconBgColor="#8B5CF6"
            gradientColors={["#581C87", "#2E1065"]}
            onPress={() =>
              router.push({
                pathname: "/orders/all-orders",
                params: {
                  tab: "eat_in,delivery,take_away,walk_in",
                  filterBy,
                  exclude_status: "completed,cancelled",
                  date_filter: filterBy,
                },
              })
            }
          />
        </View>

        <View className="flex-1">
          <KpiCard
            variant="dark"
            title="Scheduled Orders"
            value={String(metrics?.scheduledOrders || 0)}

            icon="calendar-today"
            iconColor="#FFFFFF"
            iconBgColor="#14B8A6"
            gradientColors={["#065F46", "#042F2E"]}
            onPress={() =>
              router.push({
                pathname: "/orders/all-orders",
                params: {
                  tab: "eat_in,delivery,take_away,walk_in",
                  filterBy,
                  is_schedule_order: "1",
                  date_filter: filterBy,
                },
              })
            }
          />
        </View>
      </View>

      {/* Row 3 - 1 Column (Today's Sales) */}
      <KpiCard
        variant="dark"
        title="Today's Sales"
        value={formatAmount(metrics?.todaySales || "0", currencySymbol)}
        icon="currency-pound"
        iconColor="#FFFFFF"
        iconBgColor="#F43F5E"
        gradientColors={["#881337", "#4C0519"]}
        rightElement={
          <View
            style={{
              transform: [{ rotate: "-17deg" }],
              opacity: 0.05,
              position: "absolute",
              bottom: -8,
            }}
            className="justify-center items-center pr-2 pb-1"
          >
            <Ionicons name="receipt-outline" size={WP("19%")} color="#FFFFFF" />
          </View>
        }
        onPress={() =>
          router.push({
            pathname: "/orders/todays-orders",
            params: {
              tab: "eat_in,delivery,take_away,walk_in",
              status: "completed",
            },
          })
        }
      />

      {/* Row 4 - 2 Columns (Today's Orders & Average Order) */}
      <View className="flex-row flex-1 gap-2">
        <View className="flex-1">
          <KpiCard
            variant="light"
            title="Today's Orders"
            value={String(metrics?.ordersToday || 0)}
            subtitle={`vs. ${metrics?.ordersYesterday || 0} yesterday`}
            icon="shopping-bag"
            iconColor="#F43F5E"
            iconBgColor="#FFE4E6"
            gradientColors={["#FFE4E6", "#FECDD3"]}
            onPress={() =>
              router.push({
                pathname: "/orders/todays-orders",
                params: {
                  tab: "eat_in,delivery,take_away,walk_in",
                },
              })
            }
          />
        </View>

        <View className="flex-1">
          <KpiCard
            variant="light"
            title="Average Order"
            value={formatAmount(metrics?.avgOrder || "0", currencySymbol)}

            icon="trending-up"
            iconColor="#D97706"
            iconBgColor="#FEF3C7"
            gradientColors={["#FEF3C7", "#FDE68A"]}
            onPress={() =>
              router.push({
                pathname: "/orders/all-orders",
                params: {
                  tab: "eat_in,delivery,take_away,walk_in",
                  filterBy,
                  status: "completed",
                  date_filter: filterBy,
                },
              })
            }
          />
        </View>
      </View>
    </View>
  );
}
