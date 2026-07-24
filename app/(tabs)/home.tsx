import KitchenActivity from "@/components/dashboard/KitchenActivity";
import KpiMetrics from "@/components/dashboard/KpiMetrics";
import LiveOrderBoard from "@/components/dashboard/LiveOrderBoard";
import OrdersByTypeChart from "@/components/dashboard/OrdersByTypeChart";
import Promotions from "@/components/dashboard/Promotions";
import RecentOrders from "@/components/dashboard/RecentOrders";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopDishes from "@/components/dashboard/TopDishes";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useAuth } from "@/context/AuthContext";
import {
  useDashboardMetric,
  useDashboardLiveOrderBoard,
  useDashboardRevenueChart,
  useDashboardOrdersByType,
  useDashboardKitchenActivity,
  useDashboardPromotions,
  useDashboardRecentOrders,
  useDashboardTopDishes,
} from "@/hooks/useDashboardQueries";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
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

        {/* Modular Dashboard widgets */}
        <KpiMetrics
          filterBy={filterBy}
          metrics={metricsQuery.data}
          isLoading={metricsQuery.isLoading}
        />
        <LiveOrderBoard
          liveOrderBoard={liveOrderBoardQuery.data}
          isLoading={liveOrderBoardQuery.isLoading}
        />

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
        <Promotions
          promotions={promotionsQuery.data}
          isLoading={promotionsQuery.isLoading}
        />
        <RecentOrders
          recentOrders={recentOrdersQuery.data}
          isLoading={recentOrdersQuery.isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
