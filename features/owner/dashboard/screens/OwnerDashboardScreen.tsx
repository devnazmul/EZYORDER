import LiveOrderBoard from "@/components/reuseable/dashboard/LiveOrderBoard";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KitchenActivity from "../components/KitchenActivity";
import KpiMetrics from "../components/KpiMetrics";
import OrdersByTypeChart from "../components/OrdersByTypeChart";
import Promotions from "../components/Promotions";
import RecentOrders from "../components/RecentOrders";
import RevenueChart from "../components/RevenueChart";
import TopDishes from "../components/TopDishes";
import {
  useDashboardKitchenActivity,
  useDashboardLiveOrderBoard,
  useDashboardMetric,
  useDashboardOrdersByType,
  useDashboardPromotions,
  useDashboardRecentOrders,
  useDashboardRevenueChart,
  useDashboardTopDishes,
} from "../hooks/queries/useDashboardQueries";

export default function OwnerDashboardScreen() {
  const [filterBy, setFilterBy] = useState<"this_week" | "this_month">("this_week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { token } = useAuth();

  // Queries
  const metricsQuery = useDashboardMetric(token || "", filterBy);
  const liveOrderBoardQuery = useDashboardLiveOrderBoard(token || "");
  const revenueChartQuery = useDashboardRevenueChart(token || "", filterBy);
  const ordersByTypeQuery = useDashboardOrdersByType(token || "", filterBy);
  const kitchenActivityQuery = useDashboardKitchenActivity(token || "");
  const promotionsQuery = useDashboardPromotions(token || "");
  const recentOrdersQuery = useDashboardRecentOrders(token || "");
  const topDishesQuery = useDashboardTopDishes(token || "", filterBy);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      metricsQuery.refetch(),
      liveOrderBoardQuery.refetch(),
      revenueChartQuery.refetch(),
      ordersByTypeQuery.refetch(),
      kitchenActivityQuery.refetch(),
      promotionsQuery.refetch(),
      recentOrdersQuery.refetch(),
      topDishesQuery.refetch(),
    ]);
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#DC2D2A"
            colors={["#DC2D2A"]}
          />
        }
      >
        {/* Toggle Date Period */}
        <ToggleBar
          options={[
            { id: "this_week", label: "This Week" },
            { id: "this_month", label: "This Month" },
          ]}
          activeId={filterBy}
          onSelect={setFilterBy}
          containerClassName="mb-6"
        />

        <KpiMetrics filterBy={filterBy} metrics={metricsQuery.data} isLoading={metricsQuery.isLoading} />
        <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm mb-6">
          <View className="flex-row justify-between items-center pb-3 border-b border-base-200 mb-4">
            <Text className="text-sm font-semibold text-neutral capitalize">Live Today's Order Board</Text>
          </View>
          <LiveOrderBoard
            liveOrderBoard={liveOrderBoardQuery.data}
            isLoading={liveOrderBoardQuery.isLoading}
          />
        </View>

        <View className="gap-y-6 mb-6">
          <RevenueChart
            filterBy={filterBy}
            revenueChart={revenueChartQuery.data}
            isLoading={revenueChartQuery.isLoading}
          />
          <OrdersByTypeChart
            filterBy={filterBy}
            ordersByType={ordersByTypeQuery.data}
            isLoading={ordersByTypeQuery.isLoading}
          />
          <TopDishes
            filterBy={filterBy}
            topDishes={topDishesQuery.data}
            isLoading={topDishesQuery.isLoading}
          />
        </View>

        <KitchenActivity
          kitchenActivity={kitchenActivityQuery.data}
          isLoading={kitchenActivityQuery.isLoading}
        />
        <Promotions promotions={promotionsQuery.data} isLoading={promotionsQuery.isLoading} />
        <RecentOrders recentOrders={recentOrdersQuery.data} isLoading={recentOrdersQuery.isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}
