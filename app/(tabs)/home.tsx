import AppHeader from "@/components/AppHeader";
import ENV from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const API_BASE_URL = ENV.API_BASE_URL;
  const insets = useSafeAreaInsets();
  const { user, token } = useAuth();

  const [filterBy, setFilterBy] = useState<"this_week" | "this_month">("this_week");
  const [pulseOpacity, setPulseOpacity] = useState(1);

  // Toggle green live-data pulse dot
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseOpacity((prev) => (prev === 1 ? 0.3 : 1));
    }, 800);
    return () => clearInterval(pulseInterval);
  }, []);

  // React Query call to retrieve unified dashboard data
  const {
    data: dashboardData,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["dashboardData", filterBy],
    queryFn: async () => {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const [
        metricsRes,
        liveBoardRes,
        revenueChartRes,
        ordersByTypeRes,
        topDishesRes,
        recentOrdersRes,
        promotionsRes,
        kitchenActivityRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/v1.0/dashboard-metric?date_filter=${filterBy}`, {
          headers,
          validateStatus: () => true,
        }),
        axios.get(`${API_BASE_URL}/v1.0/dashboard-live-order-board`, { headers, validateStatus: () => true }),
        axios.get(`${API_BASE_URL}/v1.0/dashboard-revenue-chart?date_filter=${filterBy}`, {
          headers,
          validateStatus: () => true,
        }),
        axios.get(`${API_BASE_URL}/v1.0/dashboard-orders-by-type?date_filter=${filterBy}`, {
          headers,
          validateStatus: () => true,
        }),
        axios.get(`${API_BASE_URL}/v1.0/dashboard-top-dishes?date_filter=${filterBy}`, {
          headers,
          validateStatus: () => true,
        }),
        axios.get(`${API_BASE_URL}/v1.0/dashboard-recent-orders`, { headers, validateStatus: () => true }),
        axios.get(`${API_BASE_URL}/v1.0/dashboard-coupon-usages`, { headers, validateStatus: () => true }),
        axios.get(`${API_BASE_URL}/v1.0/dashboard-kitchen-activity`, { headers, validateStatus: () => true }),
      ]);

      const metrics = metricsRes.status === 200 && metricsRes.data?.success ? metricsRes.data.data : null;
      const liveOrderBoard =
        liveBoardRes.status === 200 && liveBoardRes.data?.success ? liveBoardRes.data.data : null;
      const revenueChart =
        revenueChartRes.status === 200 && revenueChartRes.data?.success
          ? revenueChartRes.data.data || []
          : [];
      const ordersByType =
        ordersByTypeRes.status === 200 && ordersByTypeRes.data?.success
          ? ordersByTypeRes.data.data || []
          : [];
      const topDishes =
        topDishesRes.status === 200 && topDishesRes.data?.success ? topDishesRes.data.data || [] : [];
      const recentOrders =
        recentOrdersRes.status === 200 && recentOrdersRes.data?.success
          ? recentOrdersRes.data.data || []
          : [];

      const fallbackImages = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCZq67zMRRvi6j_fuggIGKbSOxgSe48RWATeoaI6NVBw0kwpS_FsPcSBEjMcsNLddNrpuMUwyLIxlRX6VA35rdXcmQXT9dO4Ux9xGfWxwlw1d0MoyFlVS2IIPLbZq8pYJocnZ9Dl4R8TwuiM8xXY0aZH1Pzwc_mWKpElWazEeVl2nVExqe1O8rpMIk7kMzZ4yK9cITcRhwgHyj3h-tiA3LC0XRHMSVNr_qPB4-qKKrfiX00fPu9AW1CllxA_nCFNttYuw1HuQOK3MsH",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCv9KVyFd23JV6Vd-_gMR-pfU326LNeoFOosLYmrU8M0Q2BvY8emZ7Lj2HEwLf3flLmbtTlotJiCujkWI2l4b5PIbGJnTb8xvX7QhRe3QH4cA4IZM23n2YzBKIq70Nn5dfHdAyE8WbgjVfepBMrgA4rZ56NdcTnmpCglI2Tp2bjD2nWvXcyK5joXPfVhLNSkfx6PikNFFkDHwcXVKLaBpgtHHtc0n-Owof7dFs8u0eL_bc-0doGJGiMgFvbeQQLndVsC0qBToF6ZMvZ",
      ];
      const promotions =
        promotionsRes.status === 200 && promotionsRes.data?.success
          ? (promotionsRes.data.data || []).map((promo: any, idx: number) => ({
              ...promo,
              image:
                promo.image && promo.image.startsWith("http")
                  ? promo.image
                  : fallbackImages[idx % fallbackImages.length],
            }))
          : [];

      const kitchenActivity =
        kitchenActivityRes.status === 200 && kitchenActivityRes.data?.success
          ? kitchenActivityRes.data.data
          : null;

      return {
        metrics,
        liveOrderBoard,
        revenueChart,
        ordersByType,
        topDishes,
        recentOrders,
        promotions,
        kitchenActivity,
      };
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-base-100 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="mt-4 text-xs font-semibold text-accent">Loading Dashboard...</Text>
      </SafeAreaView>
    );
  }

  // Destructure queried results safely
  const metrics = dashboardData?.metrics || {};
  const liveOrderBoard = dashboardData?.liveOrderBoard || {};
  const revenueChart = dashboardData?.revenueChart || [];
  const ordersByType = dashboardData?.ordersByType || [];
  const topDishes = dashboardData?.topDishes || [];
  const promotions = dashboardData?.promotions || [];
  const kitchenActivity = dashboardData?.kitchenActivity || {};
  const recentOrders = dashboardData?.recentOrders || [];

  // Calculate totals for ring chart
  const totalOrdersByType = ordersByType.reduce(
    (acc: number, curr: any) => acc + (parseInt(curr.value) || 0),
    0,
  );

  // Maximum value for revenue bar scaling
  const maxRevenueVal =
    revenueChart.length > 0 ? Math.max(...revenueChart.map((d: any) => parseFloat(d.value) || 0), 1) : 1;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      <AppHeader />

      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#DC2D2A"
            colors={["#DC2D2A"]}
          />
        }
      >
        {/* Toggle Date Period */}
        <View className="flex-row p-1 bg-base-200 rounded-xl mb-6">
          <TouchableOpacity
            onPress={() => setFilterBy("this_week")}
            className="flex-1 py-2.5 items-center justify-center rounded-lg"
            style={filterBy === "this_week" ? { backgroundColor: "#DC2D2A" } : undefined}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: filterBy === "this_week" ? "#FFFFFF" : "#6E6E6E" }}
            >
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterBy("this_month")}
            className="flex-1 py-2.5 items-center justify-center rounded-lg"
            style={filterBy === "this_month" ? { backgroundColor: "#DC2D2A" } : undefined}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: filterBy === "this_month" ? "#FFFFFF" : "#6E6E6E" }}
            >
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 1: Revenue Card & KPI stats */}
        <View className="gap-y-4 mb-6">
          {/* Revenue Dark Panel Card */}
          <View className="bg-neutral p-6 rounded-2xl relative overflow-hidden shadow-lg">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-[10px] font-bold text-accent tracking-widest uppercase">
                  {filterBy === "this_week" ? "THIS WEEK REVENUE" : "THIS MONTH REVENUE"}
                </Text>
                <Text className="text-3xl font-extrabold text-white mt-1">
                  £{parseFloat(metrics.revenue || "0").toFixed(2)}
                </Text>
              </View>
              <View className="bg-green-500/10 p-2.5 rounded-xl border border-green-500/20">
                <MaterialIcons name="trending-up" size={22} color="#22c55e" />
              </View>
            </View>
            <View className="flex-row items-center gap-3 mt-4">
              {metrics.revenueTrend && (
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
              <Text className="text-[10px] font-bold text-primary tracking-wider uppercase">
                TODAY'S ORDERS
              </Text>
              <Text className="text-2xl font-extrabold text-neutral mt-1">{metrics.ordersToday || 0}</Text>
              <Text className="text-[10px] text-accent mt-1">{metrics.ordersYesterday || 0} yesterday</Text>
            </View>

            {/* Average Order */}
            <View className="flex-1 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
              <Text className="text-[10px] font-bold text-yellow-600 tracking-wider uppercase">
                AVERAGE ORDER
              </Text>
              <Text className="text-2xl font-extrabold text-neutral mt-1">
                £{parseFloat(metrics.avgOrder || "0").toFixed(2)}
              </Text>
              <Text className="text-[10px] text-yellow-600/70 mt-1">Avg size</Text>
            </View>
          </View>

          {/* Horizontal scrollable indicators list */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 mt-2">
            <View className="bg-neutral px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm mr-2">
              <MaterialIcons name="restaurant" size={16} color="white" />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                ACTIVE ORDERS ({metrics.activeOrders || 0})
              </Text>
            </View>
            <View className="bg-neutral px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm mr-2">
              <MaterialIcons name="calendar-today" size={16} color="white" />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                SCHEDULED ({metrics.scheduledOrders || 0})
              </Text>
            </View>
            <View className="bg-neutral px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm">
              <MaterialIcons name="payments" size={16} color="white" />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                SALES (£{parseFloat(metrics.todaySales || "0").toFixed(2)})
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Section 2: Live Order status board */}
        <View className="mb-6 gap-y-3">
          <Text className="text-base font-bold text-neutral">Order Status</Text>
          <View className="gap-y-2">
            <View className="bg-blue-500/10 border-l-4 border-blue-500 p-4 flex-row justify-between items-center rounded-r-xl">
              <Text className="text-xs font-bold text-blue-800 tracking-wider">NEW ORDERS</Text>
              <View className="bg-blue-500 w-6 h-6 items-center justify-center rounded-full">
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.new_order || 0}</Text>
              </View>
            </View>
            <View className="bg-orange-500/10 border-l-4 border-orange-500 p-4 flex-row justify-between items-center rounded-r-xl">
              <Text className="text-xs font-bold text-orange-800 tracking-wider">PREPARING</Text>
              <View className="bg-orange-500 w-6 h-6 items-center justify-center rounded-full">
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.preparing || 0}</Text>
              </View>
            </View>
            <View className="bg-gray-500/10 border-l-4 border-gray-500 p-4 flex-row justify-between items-center rounded-r-xl opacity-60">
              <Text className="text-xs font-bold text-gray-800 tracking-wider">COMPLETED</Text>
              <View className="bg-gray-500 w-6 h-6 items-center justify-center rounded-full">
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.complete || 0}</Text>
              </View>
            </View>
            <View className="bg-pink-500/10 border-l-4 border-pink-500 p-4 flex-row justify-between items-center rounded-r-xl">
              <Text className="text-xs font-bold text-pink-800 tracking-wider">UNPAID</Text>
              <View className="bg-pink-500 w-6 h-6 items-center justify-center rounded-full">
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.unpaid || 0}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 3: Visual Analytics Charts */}
        <View className="gap-y-6 mb-6">
          {/* Revenue Chart Widget */}
          <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xs font-bold text-accent tracking-widest uppercase">
                Revenue {filterBy === "this_week" ? "This Week" : "This Month"}
              </Text>
              <MaterialIcons name="show-chart" size={20} color="#6E6E6E" />
            </View>

            {/* Custom Flex Bar Chart */}
            {revenueChart.length === 0 ? (
              <View className="items-center justify-center py-8">
                <Text className="text-xs text-accent">No revenue data available</Text>
              </View>
            ) : (
              <>
                <View className="h-32 flex-row items-end justify-between px-2 pt-4">
                  {revenueChart.map((d: any, index: number) => {
                    const val = parseFloat(d.value) || 0;
                    const barHeight = `${Math.max((val / maxRevenueVal) * 100, 5)}%`;
                    return (
                      <View key={index} className="items-center flex-1">
                        <View className="bg-primary/25 rounded-t-sm w-4" style={{ height: barHeight }} />
                      </View>
                    );
                  })}
                </View>
                <View className="flex-row justify-between px-2 mt-2 border-t border-base-200 pt-2">
                  {revenueChart.map((d: any, index: number) => (
                    <Text key={index} className="text-[9px] font-bold text-accent flex-1 text-center">
                      {d.name}
                    </Text>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Orders by Type & Top Dishes Bento row */}
          <View className="gap-y-4">
            {/* Orders by Type Pie representation */}
            <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
              <Text className="text-xs font-bold text-accent tracking-widest uppercase mb-4">
                Orders by Type
              </Text>
              {ordersByType.length === 0 ? (
                <View className="items-center justify-center py-6">
                  <Text className="text-xs text-accent">No type breakdown data available</Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-6">
                  {/* Circle ring display */}
                  <View className="relative w-24 h-24 rounded-full border-[12px] border-base-200 flex items-center justify-center">
                    <View className="absolute items-center justify-center">
                      <Text className="text-lg font-bold text-neutral">{totalOrdersByType}</Text>
                      <Text className="text-[8px] text-accent font-bold uppercase tracking-wider">Total</Text>
                    </View>
                  </View>

                  {/* Color legends list */}
                  <View className="flex-1 gap-y-2">
                    {ordersByType.map((d: any, index: number) => {
                      const val = parseInt(d.value) || 0;
                      const ratioPercent =
                        totalOrdersByType > 0 ? ((val / totalOrdersByType) * 100).toFixed(0) : "0";
                      const colorCircle =
                        index === 0 ? "bg-primary" : index === 1 ? "bg-secondary" : "bg-orange-400";
                      return (
                        <View key={index} className="flex-row justify-between items-center">
                          <View className="flex-row items-center gap-2">
                            <View className={`w-2.5 h-2.5 rounded-full ${colorCircle}`} />
                            <Text className="text-xs text-accent font-medium">{d.name}</Text>
                          </View>
                          <Text className="text-xs font-bold text-neutral">
                            {val} ({ratioPercent}%)
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Top Dishes Performance */}
            <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
              <Text className="text-xs font-bold text-accent tracking-widest uppercase mb-4">Top Dishes</Text>
              {topDishes.length === 0 ? (
                <View className="items-center justify-center py-6">
                  <Text className="text-xs text-accent">No dishes statistics available</Text>
                </View>
              ) : (
                <View className="gap-y-3">
                  {topDishes.map((dish: any, i: number) => {
                    const dishId = dish.id || dish.name || i;
                    const dishName = dish.name || "Unknown";
                    const dishCount = dish.count ?? dish.total_quantity ?? dish.order_count ?? 0;
                    return (
                      <View key={dishId} className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-3">
                          <Text className="text-xs font-bold text-primary">0{i + 1}</Text>
                          <Text className="text-xs font-medium text-neutral">{dishName}</Text>
                        </View>
                        <Text className="text-xs font-bold text-neutral">{dishCount} sold</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Section 4: Kitchen Activity box */}
        <View className="bg-neutral p-5 rounded-2xl text-white mb-6 shadow-md">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-white">Kitchen Activity</Text>
            <MaterialIcons name="local-fire-department" size={22} color="#DC2D2A" />
          </View>
          <View className="gap-y-4">
            <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
              <Text className="text-xs text-accent font-medium uppercase">WAITING ORDERS</Text>
              <Text className="text-lg font-bold text-white">{kitchenActivity.waiting || 0}</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
              <Text className="text-xs text-accent font-medium uppercase">AVG PREP TIME</Text>
              <Text className="text-lg font-bold text-green-400">{kitchenActivity.avgPrep || "00:00"}</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
              <Text className="text-xs text-accent font-medium uppercase">DELAYED</Text>
              <Text className="text-lg font-bold text-primary">{kitchenActivity.delayed || 0}</Text>
            </View>
          </View>
          <TouchableOpacity className="w-full mt-5 bg-white/10 py-3 rounded-lg flex-row items-center justify-center gap-2">
            <MaterialIcons name="visibility" size={18} color="white" />
            <Text className="text-white font-bold text-xs">OPEN KITCHEN VIEW</Text>
          </TouchableOpacity>
        </View>

        {/* Section 5: Promotions & Menu insights */}
        <View className="mb-6 gap-y-3">
          <Text className="text-base font-bold text-neutral">Promotions &amp; Menu</Text>
          {promotions.length === 0 ? (
            <View className="w-full py-8 items-center justify-center bg-base-300 rounded-xl border border-dashed border-base-200">
              <Text className="text-xs text-accent font-semibold">No active promotions</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
              {promotions.map((promo: any, idx: number) => (
                <View
                  key={idx}
                  className="w-60 bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm mr-4"
                >
                  <View className="relative w-full h-32 rounded-lg mb-3 bg-base-200 overflow-hidden">
                    <Image
                      source={{ uri: promo.image }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View className="absolute top-2 right-2 bg-green-500 px-2 py-0.5 rounded-full">
                      <Text className="text-white text-[8px] font-bold tracking-wide">{promo.status}</Text>
                    </View>
                  </View>
                  <Text className="text-xs font-bold text-neutral mb-1">{promo.name}</Text>
                  <Text className="text-[11px] text-accent leading-4" numberOfLines={2}>
                    {promo.description}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Section 6: Recent Completed Transactions list */}
        <View className="gap-y-3">
          <Text className="text-base font-bold text-neutral">Recent Completed</Text>
          <View className="bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm">
            {recentOrders.length === 0 ? (
              <View className="items-center justify-center py-8">
                <Text className="text-xs text-accent">No recent completed transactions</Text>
              </View>
            ) : (
              <View className="divide-y divide-base-200">
                {recentOrders.map((o: any, index: number) => {
                  const orderId = o.id || index;
                  const customerName =
                    o.customer_name ||
                    o.user?.first_Name ||
                    (o.table_number && parseFloat(o.table_number) > 0
                      ? `Table ${parseFloat(o.table_number)}`
                      : "Walk-in Customer");
                  const orderPrice = o.amount || o.final_price || "0.00";
                  return (
                    <View key={orderId} className="p-4 flex-row items-center justify-between">
                      <View>
                        <Text className="text-xs font-bold text-neutral">#{o.id}</Text>
                        <Text className="text-[9px] text-accent uppercase font-bold mt-1">
                          {customerName} • {o.type || "Order"}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-4">
                        <Text className="text-xs font-bold text-neutral">
                          £{parseFloat(orderPrice).toFixed(2)}
                        </Text>
                        <View className="bg-green-100 px-2 py-0.5 rounded-full">
                          <Text className="text-green-700 text-[9px] font-bold uppercase">{o.status}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            <TouchableOpacity className="w-full py-4 items-center justify-center border-t border-base-200">
              <Text className="text-xs font-bold text-primary uppercase">VIEW ALL HISTORY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
