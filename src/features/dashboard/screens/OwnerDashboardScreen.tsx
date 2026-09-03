import ActionCard from "@/components/reuseable/cards/ActionCard";
import LiveOrderBoard from "@/components/reuseable/dashboard/LiveOrderBoard";
import LiveOrderBoardSkeleton from "@/components/reuseable/skeletons/LiveOrderBoardSkeleton";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { WP } from "@/utils/getResponsiveSizes";
import { useState } from "react";
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
  const [filterBy, setFilterBy] = useState<"this_week" | "this_month">(
    "this_week",
  );
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
        className="flex-1 pt-4"
        style={{ paddingHorizontal: WP("4%") }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="gap-y-3">
            {/* Toggle Date Period */}
            <ToggleBar
              options={[
                { id: "this_week", label: "This Week" },
                { id: "this_month", label: "This Month" },
              ]}
              activeId={filterBy}
              onSelect={setFilterBy}
              containerClassName=""
            />

            <KpiMetrics
              filterBy={filterBy}
              metrics={metricsQuery.data}
              revenueChart={revenueChartQuery.data}
              isLoading={metricsQuery.isLoading || metricsQuery.isRefetching}
            />

            {/* Live Order Board ActionCard */}
            <ActionCard
              title="Live Today's Order Board"
              isLoading={
                liveOrderBoardQuery.isLoading ||
                liveOrderBoardQuery.isRefetching
              }
              skeleton={<LiveOrderBoardSkeleton />}
              bodyStyle={{ paddingHorizontal: WP("4%") }}
              bodyClassName="pb-4"
            >
              <LiveOrderBoard liveOrderBoard={liveOrderBoardQuery.data} />
            </ActionCard>

            {/* Charts & Top Dishes */}
            <RevenueChart
              filterBy={filterBy}
              revenueChart={revenueChartQuery.data}
              isLoading={
                metricsQuery.isLoading ||
                revenueChartQuery.isLoading ||
                revenueChartQuery.isRefetching
              }
            />
            <OrdersByTypeChart
              filterBy={filterBy}
              ordersByType={ordersByTypeQuery.data}
              isLoading={
                ordersByTypeQuery.isLoading || ordersByTypeQuery.isRefetching
              }
            />
            <TopDishes
              filterBy={filterBy}
              topDishes={topDishesQuery.data}
              isLoading={
                topDishesQuery.isLoading || topDishesQuery.isRefetching
              }
            />

            {/* Kitchen Activity, Promotions & Recent Orders */}
            <KitchenActivity
              kitchenActivity={kitchenActivityQuery.data}
              isLoading={
                kitchenActivityQuery.isLoading ||
                kitchenActivityQuery.isRefetching
              }
            />
            <Promotions
              promotions={promotionsQuery.data}
              isLoading={
                promotionsQuery.isLoading || promotionsQuery.isRefetching
              }
            />
            <RecentOrders
              recentOrders={recentOrdersQuery.data}
              isLoading={
                recentOrdersQuery.isLoading || recentOrdersQuery.isRefetching
              }
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}
