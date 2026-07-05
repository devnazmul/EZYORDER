import { useAuth } from "@/context/AuthContext";
import { useDashboardMetric } from "@/hooks/useDashboardQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface KpiMetricsProps {
  filterBy: string;
}

export default function KpiMetrics({ filterBy }: KpiMetricsProps) {
  const { token } = useAuth();
  const { data: metrics = {}, isLoading } = useDashboardMetric(token || "", filterBy);
  const [pulseOpacity, setPulseOpacity] = useState(1);

  // Toggle green live-data pulse dot
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseOpacity((prev) => (prev === 1 ? 0.3 : 1));
    }, 800);
    return () => clearInterval(pulseInterval);
  }, []);

  if (isLoading) {
    return (
      <View key="loading" className="bg-base-300 p-6 rounded-2xl min-h-[160px] justify-center items-center">
        <Text className="text-xs text-accent">Loading KPI stats...</Text>
      </View>
    );
  }

  const revenueVal = parseFloat(metrics?.revenue || "0").toFixed(2);
  const avgOrderVal = parseFloat(metrics?.avgOrder || "0").toFixed(2);

  return (
    <View key="loaded" className="gap-y-4 mb-6">
      {/* Revenue Dark Panel Card */}
      <View className="bg-neutral p-6 rounded-2xl relative overflow-hidden shadow-lg">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-[10px] font-bold text-accent tracking-widest uppercase">
              {filterBy === "this_week" ? "THIS WEEK REVENUE" : "THIS MONTH REVENUE"}
            </Text>
            <Text className="text-3xl font-extrabold text-white mt-1">£{revenueVal}</Text>
          </View>
          <View className="bg-green-500/10 p-2.5 rounded-xl border border-green-500/20">
            <MaterialIcons name="trending-up" size={22} color="#22c55e" />
          </View>
        </View>
        <View className="flex-row items-center gap-3 mt-4">
          {metrics?.revenueTrend && (
            <View className="bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-primary">{metrics.revenueTrend}</Text>
            </View>
          )}
          <View className="flex-row items-center gap-1.5 opacity-80">
            <View className="w-2 h-2 rounded-full bg-green-500" style={{ opacity: pulseOpacity }} />
            <Text className="text-[10px] font-bold text-accent tracking-wider">LIVE DATA</Text>
          </View>
        </View>
      </View>

      {/* Side by side Stats cards */}
      <View className="flex-row gap-4">
        {/* Today's Orders */}
        <View className="flex-1 bg-primary/5 p-4 rounded-xl border border-primary/10">
          <Text className="text-[10px] font-bold text-primary tracking-wider uppercase">TODAY'S ORDERS</Text>
          <Text className="text-2xl font-extrabold text-neutral mt-1">{metrics?.ordersToday || 0}</Text>
          <Text className="text-[10px] text-accent mt-1">{metrics?.ordersYesterday || 0} yesterday</Text>
        </View>

        {/* Average Order */}
        <View className="flex-1 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
          <Text className="text-[10px] font-bold text-yellow-600 tracking-wider uppercase">
            AVERAGE ORDER
          </Text>
          <Text className="text-2xl font-extrabold text-neutral mt-1">£{avgOrderVal}</Text>
          <Text className="text-[10px] text-yellow-600/70 mt-1">Avg size</Text>
        </View>
      </View>

      {/* Horizontal Scrollable Indicators List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2 ">
        {/* Active Orders */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/orders/all-orders")}
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
          onPress={() => router.push("/orders/all-orders")}
          className="bg-[#1b1b1b] px-4 py-2.5 rounded-lg flex-row items-center gap-2 mr-2"
        >
          <MaterialIcons name="calendar-today" size={16} color="white" />
          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
            SCHEDULED ({metrics?.scheduledOrders || 0})
          </Text>
        </TouchableOpacity>
        {/* Sales */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/orders/all-orders")}
          className="bg-[#1b1b1b] px-4 py-2.5 rounded-lg flex-row items-center gap-2"
        >
          <MaterialIcons name="payments" size={16} color="white" />
          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
            SALES (£{parseFloat(metrics?.todaySales || "0").toFixed(2)})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
