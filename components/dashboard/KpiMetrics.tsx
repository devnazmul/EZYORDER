import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

cssInterop(MaterialIcons, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

interface KpiMetricsProps {
  filterBy: string;
  metrics: any;
  isLoading: boolean;
}

export default function KpiMetrics({ filterBy, metrics = {}, isLoading }: KpiMetricsProps) {
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const isNegativeTrend = useMemo(() => {
    const trend = metrics?.revenueTrend || "";
    return trend.includes("-");
  }, [metrics?.revenueTrend]);

  if (isLoading) {
    return (
      <View key="loading" className="bg-base-300 p-6 rounded-2xl min-h-[160px] justify-center items-center">
        <Text className="text-xs text-accent">Loading KPI stats...</Text>
      </View>
    );
  }

  return (
    <View key="loaded" className="gap-y-4 mb-6">
      {/* Revenue Dark Panel Card (Row 1 - 1 Column) */}
      <TouchableOpacity
        activeOpacity={0.9}
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
        className="bg-neutral p-6 rounded-2xl relative overflow-hidden shadow-lg"
      >
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-[10px] font-bold text-accent tracking-widest uppercase">
              {filterBy === "this_week" ? "THIS WEEK REVENUE" : "THIS MONTH REVENUE"}
            </Text>
            <Text className="text-3xl font-extrabold text-white mt-1">
              {formatAmount(metrics?.revenue || "0", currencySymbol)}
            </Text>
          </View>
          <View
            className={
              isNegativeTrend
                ? "bg-error/10 p-2.5 rounded-xl border border-error/20"
                : "bg-success/10 p-2.5 rounded-xl border border-success/20"
            }
          >
            <MaterialIcons
              name={isNegativeTrend ? "trending-down" : "trending-up"}
              size={22}
              className={isNegativeTrend ? "text-error" : "text-success"}
            />
          </View>
        </View>
        <View className="flex-row items-center gap-3 mt-4">
          {metrics?.revenueTrend && (
            <View
              className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full border ${
                isNegativeTrend ? "bg-error/20 border-error/30" : "bg-success/20 border-success/30"
              }`}
            >
              <MaterialIcons
                name={isNegativeTrend ? "trending-down" : "trending-up"}
                size={12}
                className={isNegativeTrend ? "text-error" : "text-success"}
              />
              <Text
                className={`text-[10px] font-bold ${isNegativeTrend ? "text-error" : "text-success"}`}
              >
                {metrics.revenueTrend} vs {filterBy === "this_week" ? "Last Week" : "Last Month"}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Row 2 - 2 Columns */}
      <View className="flex-row gap-4">
        {/* Today's Orders */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/orders/todays-orders",
              params: {
                tab: "eat_in,delivery,take_away,walk_in",
              },
            })
          }
          className="flex-1 bg-primary/5 p-4 rounded-xl border border-primary/10"
        >
          <Text className="text-[10px] font-bold text-primary tracking-wider uppercase">TODAY'S ORDERS</Text>
          <Text className="text-2xl font-extrabold text-neutral mt-1">{metrics?.ordersToday || 0}</Text>
          <Text className="text-[10px] text-accent mt-1">{metrics?.ordersYesterday || 0} yesterday</Text>
        </TouchableOpacity>

        {/* Average Order */}
        <TouchableOpacity
          activeOpacity={0.8}
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
          className="flex-1 bg-warning/5 p-4 rounded-xl border border-warning/10"
        >
          <Text className="text-[10px] font-bold text-warning tracking-wider uppercase">
            AVERAGE ORDER
          </Text>
          <Text className="text-2xl font-extrabold text-neutral mt-1">
            {formatAmount(metrics?.avgOrder || "0", currencySymbol)}
          </Text>
          <Text className="text-[10px] text-accent mt-1">Avg size</Text>
        </TouchableOpacity>
      </View>

      {/* Row 3 - 1 Column */}
      {/* Today's Sales */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/orders/todays-orders",
            params: {
              tab: "eat_in,delivery,take_away,walk_in",
              status: "completed",
            },
          })
        }
        className="bg-success/5 p-4 rounded-xl border border-success/10 flex-row justify-between items-center"
      >
        <View>
          <Text className="text-[10px] font-bold text-success tracking-wider uppercase">TODAY'S SALES</Text>
          <Text className="text-2xl font-extrabold text-neutral mt-1">
            {formatAmount(metrics?.todaySales || "0", currencySymbol)}
          </Text>
        </View>
        <View className="bg-success/10 p-2.5 rounded-xl border border-success/20">
          <MaterialIcons name="payments" size={22} className="text-success" />
        </View>
      </TouchableOpacity>

      {/* Row 4 - 2 Columns */}
      <View className="flex-row gap-4">
        {/* Active Orders */}
        <TouchableOpacity
          activeOpacity={0.8}
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
          className="flex-1 bg-info/5 p-4 rounded-xl border border-info/10"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-[10px] font-bold text-info tracking-wider uppercase">ACTIVE ORDERS</Text>
            <MaterialIcons name="restaurant" size={16} className="text-info" />
          </View>
          <Text className="text-2xl font-extrabold text-neutral mt-2">{metrics?.activeOrders || 0}</Text>
          <Text className="text-[10px] text-accent mt-1">In progress</Text>
        </TouchableOpacity>

        {/* Scheduled Orders */}
        <TouchableOpacity
          activeOpacity={0.8}
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
          className="flex-1 bg-secondary/5 p-4 rounded-xl border border-secondary/10"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-[10px] font-bold text-secondary tracking-wider uppercase">SCHEDULED</Text>
            <MaterialIcons name="calendar-today" size={16} className="text-secondary" />
          </View>
          <Text className="text-2xl font-extrabold text-neutral mt-2">{metrics?.scheduledOrders || 0}</Text>
          <Text className="text-[10px] text-accent mt-1">Booked ahead</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
