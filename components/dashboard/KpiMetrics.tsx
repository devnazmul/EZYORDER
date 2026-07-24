import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface KpiMetricsProps {
  filterBy: string;
  metrics: any;
  isLoading: boolean;
}

export default function KpiMetrics({ filterBy, metrics = {}, isLoading }: KpiMetricsProps) {
  const { settings } = useData();

  // Resolve currency symbol
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
      {/* Revenue Dark Panel Card */}
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
                ? "bg-red-500/10 p-2.5 rounded-xl border border-red-500/20"
                : "bg-green-500/10 p-2.5 rounded-xl border border-green-500/20"
            }
          >
            <MaterialIcons
              name={isNegativeTrend ? "trending-down" : "trending-up"}
              size={22}
              color={isNegativeTrend ? "#ef4444" : "#22c55e"}
            />
          </View>
        </View>
        <View className="flex-row items-center gap-3 mt-4">
          {metrics?.revenueTrend && (
            <View
              className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full border ${
                isNegativeTrend ? "bg-red-500/20 border-red-500/30" : "bg-green-500/20 border-green-500/30"
              }`}
            >
              <MaterialIcons
                name={isNegativeTrend ? "trending-down" : "trending-up"}
                size={12}
                color={isNegativeTrend ? "#f87171" : "#4ade80"}
              />
              <Text
                className={`text-[10px] font-bold ${isNegativeTrend ? "text-red-400" : "text-green-400"}`}
              >
                {metrics.revenueTrend} vs {filterBy === "this_week" ? "Last Week" : "Last Month"}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Side by side Stats cards */}
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
          className="flex-1 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10"
        >
          <Text className="text-[10px] font-bold text-yellow-600 tracking-wider uppercase">
            AVERAGE ORDER
          </Text>
          <Text className="text-2xl font-extrabold text-neutral mt-1">
            {formatAmount(metrics?.avgOrder || "0", currencySymbol)}
          </Text>
          <Text className="text-[10px] text-yellow-600/70 mt-1">Avg size</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Indicators List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2 ">
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
          className="bg-[#1b1b1b] px-4 py-2.5 rounded-lg flex-row items-center gap-2 mr-2"
        >
          <MaterialIcons name="restaurant" size={16} color="white" />
          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
            ACTIVE ORDERS ({metrics?.activeOrders || 0})
          </Text>
        </TouchableOpacity>
        {/* Scheduled */}
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
          className="bg-[#1b1b1b] px-4 py-2.5 rounded-lg flex-row items-center gap-2 mr-2"
        >
          <MaterialIcons name="calendar-today" size={16} color="white" />
          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
            SCHEDULED ORDERS ({metrics?.scheduledOrders || 0})
          </Text>
        </TouchableOpacity>
        {/* Sales */}
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
          className="bg-[#1b1b1b] px-4 py-2.5 rounded-lg flex-row items-center gap-2"
        >
          <MaterialIcons name="payments" size={16} color="white" />
          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
            TODAY'S SALES ({formatAmount(metrics?.todaySales || "0", currencySymbol)})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
