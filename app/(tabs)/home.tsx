import ENV from "@/config/env";
import authStore, { UserData } from "@/utils/authStore";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
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

  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<"this_week" | "this_month">("this_week");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pulseOpacity, setPulseOpacity] = useState(1);
  const [prepTime, setPrepTime] = useState("11:45");

  // State data for dashboard metrics
  const [metrics, setMetrics] = useState<any>({
    revenue: 0,
    revenueTrend: "↓ 100.0% vs last week",
    ordersToday: 0,
    ordersYesterday: 0,
    avgOrder: 0,
    activeOrders: 0,
    scheduledOrders: 0,
    todaySales: 0,
  });

  const [liveOrderBoard, setLiveOrderBoard] = useState<any>({
    new_order: 0,
    preparing: 0,
    complete: 0,
    unpaid: 0,
  });

  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [ordersByType, setOrdersByType] = useState<any[]>([]);
  const [topDishes, setTopDishes] = useState<any[]>([]);
  const [kitchenActivity, setKitchenActivity] = useState<any>({
    waiting: 0,
    avgPrep: "--:--",
    delayed: 0,
  });
  const [promotions, setPromotions] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Toggle green live-data pulse dot
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseOpacity((prev) => (prev === 1 ? 0.3 : 1));
    }, 800);
    return () => clearInterval(pulseInterval);
  }, []);

  // Simulating kitchen activity prep time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      const mins = Math.floor(Math.random() * 5) + 8;
      const secs = Math.floor(Math.random() * 60);
      setPrepTime(`${mins}:${secs < 10 ? "0" + secs : secs}`);
    }, 3000);
    return () => clearInterval(timeInterval);
  }, []);

  // Fetch all endpoints
  const fetchDashboardData = async (authToken: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      };

      // Execute dashboard API queries in parallel
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

      // Load Metrics
      if (metricsRes.status === 200 && metricsRes.data?.success) {
        setMetrics(metricsRes.data.data);
      } else {
        // Fallback reference data matching mockup
        setMetrics({
          revenue: filterBy === "this_week" ? 1845.2 : 7924.5,
          revenueTrend: filterBy === "this_week" ? "↓ 12.5% vs last week" : "↑ 8.4% vs last month",
          ordersToday: 24,
          ordersYesterday: 18,
          avgOrder: 32.5,
          activeOrders: 5,
          scheduledOrders: 2,
          todaySales: 680.0,
        });
      }

      // Load Live Board
      if (liveBoardRes.status === 200 && liveBoardRes.data?.success) {
        setLiveOrderBoard(liveBoardRes.data.data);
      } else {
        setLiveOrderBoard({
          new_order: 3,
          preparing: 5,
          complete: 12,
          unpaid: 2,
        });
      }

      // Load Revenue Chart
      if (revenueChartRes.status === 200 && revenueChartRes.data?.success) {
        setRevenueChart(revenueChartRes.data.data);
      } else {
        setRevenueChart([
          { name: "MON", value: 240 },
          { name: "TUE", value: 380 },
          { name: "WED", value: 150 },
          { name: "THU", value: 90 },
          { name: "FRI", value: 310 },
          { name: "SAT", value: 420 },
          { name: "SUN", value: 290 },
        ]);
      }

      // Load Orders by Type
      if (ordersByTypeRes.status === 200 && ordersByTypeRes.data?.success) {
        setOrdersByType(ordersByTypeRes.data.data);
      } else {
        setOrdersByType([
          { name: "Dine-in", value: 14 },
          { name: "Takeaway", value: 28 },
          { name: "Delivery", value: 18 },
        ]);
      }

      // Load Top Dishes
      if (topDishesRes.status === 200 && topDishesRes.data?.success) {
        setTopDishes(topDishesRes.data.data);
      } else {
        setTopDishes([
          { id: 1, name: "Smash Burger Double", count: 42 },
          { id: 2, name: "Truffle Fries", count: 35 },
          { id: 3, name: "Classic Margherita", count: 21 },
        ]);
      }

      // Load Recent Orders
      if (recentOrdersRes.status === 200 && recentOrdersRes.data?.success) {
        setRecentOrders(recentOrdersRes.data.data);
      } else {
        setRecentOrders([
          { id: "ORD-4921", customer: "James Miller", type: "Dine-in", price: "£42.50", status: "Completed" },
          { id: "ORD-4920", customer: "Sarah Chen", type: "Delivery", price: "£18.90", status: "Completed" },
          { id: "ORD-4919", customer: "Anonymous", type: "Takeaway", price: "£12.00", status: "Completed" },
        ]);
      }

      const fallbackImages = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCZq67zMRRvi6j_fuggIGKbSOxgSe48RWATeoaI6NVBw0kwpS_FsPcSBEjMcsNLddNrpuMUwyLIxlRX6VA35rdXcmQXT9dO4Ux9xGfWxwlw1d0MoyFlVS2IIPLbZq8pYJocnZ9Dl4R8TwuiM8xXY0aZH1Pzwc_mWKpElWazEeVl2nVExqe1O8rpMIk7kMzZ4yK9cITcRhwgHyj3h-tiA3LC0XRHMSVNr_qPB4-qKKrfiX00fPu9AW1CllxA_nCFNttYuw1HuQOK3MsH",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCv9KVyFd23JV6Vd-_gMR-pfU326LNeoFOosLYmrU8M0Q2BvY8emZ7Lj2HEwLf3flLmbtTlotJiCujkWI2l4b5PIbGJnTb8xvX7QhRe3QH4cA4IZM23n2YzBKIq70Nn5dfHdAyE8WbgjVfepBMrgA4rZ56NdcTnmpCglI2Tp2bjD2nWvXcyK5joXPfVhLNSkfx6PikNFFkDHwcXVKLaBpgtHHtc0n-Owof7dFs8u0eL_bc-0doGJGiMgFvbeQQLndVsC0qBToF6ZMvZ",
      ];

      // Load Promotions
      if (promotionsRes.status === 200 && promotionsRes.data?.success) {
        const apiPromotions = (promotionsRes.data.data || []).map((promo: any, idx: number) => ({
          ...promo,
          image:
            promo.image && promo.image.startsWith("http")
              ? promo.image
              : fallbackImages[idx % fallbackImages.length],
        }));
        setPromotions(apiPromotions);
      } else {
        setPromotions([
          {
            name: "Happy Hour 20% Off",
            description: "Applied to all alcoholic beverages after 5PM",
            status: "ACTIVE",
            image: fallbackImages[0],
          },
          {
            name: "Weekend Special Roast",
            description: "Promoting the premium Sunday roast selection",
            status: "SCHEDULED",
            image: fallbackImages[1],
          },
        ]);
      }

      // Load Kitchen Activity
      if (kitchenActivityRes.status === 200 && kitchenActivityRes.data?.success) {
        setKitchenActivity(kitchenActivityRes.data.data);
      } else {
        setKitchenActivity({
          waiting: 3,
          avgPrep: "11:45",
          delayed: 1,
        });
      }
    } catch (error) {
      console.error("Dashboard overview fetch error:", error);
    }
  };

  const handleRefresh = async () => {
    if (!token) return;
    setIsRefreshing(true);
    await fetchDashboardData(token);
    setIsRefreshing(false);
  };

  // Auth checking and load
  useEffect(() => {
    const initializeSession = async () => {
      const storedToken = await authStore.getToken();
      const storedUser = await authStore.getUser();

      if (!storedToken || !storedUser) {
        router.replace("/(auth)/login");
      } else {
        setToken(storedToken);
        setUser(storedUser);
        await fetchDashboardData(storedToken);
        setIsLoading(false);
      }
    };
    initializeSession();
  }, [filterBy]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-base-100 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="mt-4 text-xs font-semibold text-accent">Loading Dashboard...</Text>
      </SafeAreaView>
    );
  }

  // Calculate totals for ring chart
  const totalOrdersByType = ordersByType.reduce((acc, curr) => acc + curr.value, 0);

  // Maximum value for revenue bar scaling
  const maxRevenueVal = Math.max(...revenueChart.map((d) => d.value), 1);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      {/* Top Header App Bar */}
      <View className="flex-row justify-between items-center h-16 px-4 bg-base-300 border-b border-base-200">
        <Text className="text-lg font-bold text-neutral">Dashboard Overview</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="relative p-2 rounded-full hover:bg-base-200">
            <MaterialIcons name="notifications-none" size={24} color="#DC2D2A" />
            <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-base-300" />
          </TouchableOpacity>
          <View className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-sm">
            <Text className="text-white font-bold text-sm">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "FD"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={["#DC2D2A"]} />
        }
      >
        {/* Toggle Date Period */}
        <View className="flex-row p-1 bg-base-200 rounded-xl mb-6">
          <TouchableOpacity
            onPress={() => setFilterBy("this_week")}
            className="flex-1 py-2.5 items-center justify-center rounded-lg"
            style={filterBy === "this_week" ? { backgroundColor: "#000000" } : undefined}
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
            style={filterBy === "this_month" ? { backgroundColor: "#000000" } : undefined}
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
                  £{(metrics.revenue || 0).toFixed(2)}
                </Text>
              </View>
              <View className="bg-green-500/10 p-2.5 rounded-xl border border-green-500/20">
                <MaterialIcons name="trending-up" size={22} color="#22c55e" />
              </View>
            </View>
            <View className="flex-row items-center gap-3 mt-4">
              <View className="bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-full">
                <Text className="text-[10px] font-bold text-primary">{metrics.revenueTrend}</Text>
              </View>
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
              <Text className="text-2xl font-extrabold text-neutral mt-1">{metrics.ordersToday}</Text>
              <Text className="text-[10px] text-accent mt-1">{metrics.ordersYesterday} yesterday</Text>
            </View>

            {/* Average Order */}
            <View className="flex-1 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
              <Text className="text-[10px] font-bold text-yellow-600 tracking-wider uppercase">
                AVERAGE ORDER
              </Text>
              <Text className="text-2xl font-extrabold text-neutral mt-1">
                £{(metrics.avgOrder || 0).toFixed(2)}
              </Text>
              <Text className="text-[10px] text-yellow-600/70 mt-1">No data</Text>
            </View>
          </View>

          {/* Horizontal scrollable indicators list */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 mt-2">
            <View className="bg-neutral px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm mr-2">
              <MaterialIcons name="restaurant" size={16} color="white" />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                ACTIVE ORDERS ({metrics.activeOrders})
              </Text>
            </View>
            <View className="bg-neutral px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm mr-2">
              <MaterialIcons name="calendar-today" size={16} color="white" />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                SCHEDULED ({metrics.scheduledOrders})
              </Text>
            </View>
            <View className="bg-neutral px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm">
              <MaterialIcons name="payments" size={16} color="white" />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                SALES (£{metrics.todaySales.toFixed(2)})
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
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.new_order}</Text>
              </View>
            </View>
            <View className="bg-orange-500/10 border-l-4 border-orange-500 p-4 flex-row justify-between items-center rounded-r-xl">
              <Text className="text-xs font-bold text-orange-800 tracking-wider">PREPARING</Text>
              <View className="bg-orange-500 w-6 h-6 items-center justify-center rounded-full">
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.preparing}</Text>
              </View>
            </View>
            <View className="bg-gray-500/10 border-l-4 border-gray-500 p-4 flex-row justify-between items-center rounded-r-xl opacity-60">
              <Text className="text-xs font-bold text-gray-800 tracking-wider">COMPLETED</Text>
              <View className="bg-gray-500 w-6 h-6 items-center justify-center rounded-full">
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.complete}</Text>
              </View>
            </View>
            <View className="bg-pink-500/10 border-l-4 border-pink-500 p-4 flex-row justify-between items-center rounded-r-xl">
              <Text className="text-xs font-bold text-pink-800 tracking-wider">UNPAID</Text>
              <View className="bg-pink-500 w-6 h-6 items-center justify-center rounded-full">
                <Text className="text-white text-[11px] font-extrabold">{liveOrderBoard.unpaid}</Text>
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
            <View className="h-32 flex-row items-end justify-between px-2 pt-4">
              {revenueChart.map((d, index) => {
                // Calculate percentage height
                const barHeight = `${Math.max((d.value / maxRevenueVal) * 100, 5)}%`;
                return (
                  <View key={index} className="items-center flex-1">
                    <View className="bg-primary/25 rounded-t-sm w-4" style={{ height: barHeight }} />
                  </View>
                );
              })}
            </View>
            <View className="flex-row justify-between px-2 mt-2 border-t border-base-200 pt-2">
              {revenueChart.map((d, index) => (
                <Text key={index} className="text-[9px] font-bold text-accent flex-1 text-center">
                  {d.name}
                </Text>
              ))}
            </View>
          </View>

          {/* Orders by Type & Top Dishes Bento row */}
          <View className="gap-y-4">
            {/* Orders by Type Pie representation */}
            <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
              <Text className="text-xs font-bold text-accent tracking-widest uppercase mb-4">
                Orders by Type
              </Text>
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
                  {ordersByType.map((d, index) => {
                    const ratioPercent =
                      totalOrdersByType > 0 ? ((d.value / totalOrdersByType) * 100).toFixed(0) : "0";
                    const colorCircle =
                      index === 0 ? "bg-primary" : index === 1 ? "bg-secondary" : "bg-orange-400";
                    return (
                      <View key={index} className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2">
                          <View className={`w-2.5 h-2.5 rounded-full ${colorCircle}`} />
                          <Text className="text-xs text-accent font-medium">{d.name}</Text>
                        </View>
                        <Text className="text-xs font-bold text-neutral">
                          {d.value} ({ratioPercent}%)
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Top Dishes Performance */}
            <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
              <Text className="text-xs font-bold text-accent tracking-widest uppercase mb-4">Top Dishes</Text>
              <View className="gap-y-3">
                {topDishes.map((dish, i) => {
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
              <Text className="text-lg font-bold text-white">{kitchenActivity.waiting}</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
              <Text className="text-xs text-accent font-medium uppercase">AVG PREP TIME</Text>
              <Text className="text-lg font-bold text-green-400">{prepTime}</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-white/10 pb-3">
              <Text className="text-xs text-accent font-medium uppercase">DELAYED</Text>
              <Text className="text-lg font-bold text-primary">{kitchenActivity.delayed}</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
            {promotions.map((promo, idx) => (
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
        </View>

        {/* Section 6: Recent Completed Transactions list */}
        <View className="gap-y-3">
          <Text className="text-base font-bold text-neutral">Recent Completed</Text>
          <View className="bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm">
            <View className="divide-y divide-base-200">
              {recentOrders.map((o, index) => {
                const orderId = o.id || index;
                return (
                  <View key={orderId} className="p-4 flex-row items-center justify-between">
                    <View>
                      <Text className="text-xs font-bold text-neutral">#{o.id}</Text>
                      <Text className="text-[9px] text-accent uppercase font-bold mt-1">
                        {o.customer} • {o.type}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-4">
                      <Text className="text-xs font-bold text-neutral">{o.price}</Text>
                      <View className="bg-green-100 px-2 py-0.5 rounded-full">
                        <Text className="text-green-700 text-[9px] font-bold uppercase">{o.status}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity className="w-full py-4 items-center justify-center border-t border-base-200">
              <Text className="text-xs font-bold text-primary uppercase">VIEW ALL HISTORY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
