import AppHeader from "@/components/AppHeader";
import KitchenActivity from "@/components/dashboard/KitchenActivity";
import KpiMetrics from "@/components/dashboard/KpiMetrics";
import LiveOrderBoard from "@/components/dashboard/LiveOrderBoard";
import OrdersByTypeChart from "@/components/dashboard/OrdersByTypeChart";
import Promotions from "@/components/dashboard/Promotions";
import RecentOrders from "@/components/dashboard/RecentOrders";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopDishes from "@/components/dashboard/TopDishes";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [filterBy, setFilterBy] = useState<"this_week" | "this_month">("this_week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardLiveOrderBoard"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardRevenueChart"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardOrdersByTypeChart"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardKitchenActivityCard"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardPromotionsTable"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardRecentOrdersTable"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardTopDishesPerformance"] }),
    ]);
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      <AppHeader />

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
        <KpiMetrics filterBy={filterBy} />
        <LiveOrderBoard />

        <View className="gap-y-6 mb-6">
          <RevenueChart filterBy={filterBy} />
          <OrdersByTypeChart filterBy={filterBy} />
          <TopDishes filterBy={filterBy} />
        </View>

        <KitchenActivity />
        <Promotions />
        <RecentOrders />
      </ScrollView>
    </SafeAreaView>
  );
}
