import AppHeader from "@/components/AppHeader";
import LiveOrderBoard from "@/components/reuseable/dashboard/LiveOrderBoard";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { useOwnerProfileQuery } from "@/hooks/useUserQueries";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AssignedOrdersFeed from "../components/AssignedOrdersFeed";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import DriverActiveOrder from "../components/DriverActiveOrder";
import DriverQuickStats from "../components/DriverQuickStats";
import OrderDetailsDrawer from "../components/OrderDetailsDrawer";
import { useUpdateDriverOrderStatusMutation } from "../hooks/mutations/useDriverMutations";
import {
  useDriverActiveAssignedOrdersQuery,
  useDriverDashboardStatsQuery,
} from "../hooks/queries/useDriverQueries";
import { DriverOrder } from "../types";

export default function DriverDashboardScreen() {
  const { token, user, logout } = useAuth();

  // Queries
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
    refetch: refetchStats,
  } = useDriverDashboardStatsQuery(token || "");

  const {
    data: activeOrders,
    isLoading: isLoadingActiveOrders,
    isFetching: isFetchingActiveOrders,
    refetch: refetchActiveOrders,
  } = useDriverActiveAssignedOrdersQuery(token || "");

  const isStatsLoading = isLoadingStats || isFetchingStats || !statsData;
  const isActiveOrdersLoading = isLoadingActiveOrders || isFetchingActiveOrders || !activeOrders;

  const { data: profileData, refetch: refetchProfile } = useOwnerProfileQuery(token || "", user?.id || null);

  const profileUser = useMemo(() => {
    if (!profileData) return null;
    return profileData.user || profileData.data?.user || null;
  }, [profileData]);

  const activeUser = profileUser || user;

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<DriverOrder | null>(null);

  const updateOrderStatusMutation = useUpdateDriverOrderStatusMutation(token || "");

  const currencySymbol = useMemo(() => {
    if (statsData) {
      return getCurrencySymbol(statsData.currency_symbol);
    }
  }, [statsData]);

  const filteredActiveOrders = useMemo(() => {
    if (!activeOrders) return [];
    return activeOrders.filter(
      (order: DriverOrder) => order.delivery_status !== "delivered" && order.status !== "delivered",
    );
  }, [activeOrders]);

  // Re-fetch all queries on pull-to-refresh
  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchActiveOrders(), refetchProfile()]);
  };

  const orderBoard = useMemo(() => {
    const ob = statsData?.order_board;
    if (!ob) return undefined;
    return {
      new_order: ob.new_order ?? ob.new_orders ?? 0,
      preparing: ob.preparing ?? 0,
      complete: ob.complete ?? ob.completed ?? 0,
      unpaid: ob.unpaid ?? 0,
    };
  }, [statsData?.order_board]);

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader />

      <RefreshableScrollView
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 60, gap: 10 }}
        showsVerticalScrollIndicator={false}
        className="px-4"
      >
        <WelcomeHeader user={activeUser} />

        <DriverQuickStats
          isLoadingStats={isStatsLoading}
          stats={statsData?.stats}
          currencySymbol={currencySymbol}
          distanceUnit={statsData?.distance_unit}
        />

        <DriverActiveOrder
          ordersList={filteredActiveOrders}
          isLoading={isActiveOrdersLoading}
          updateStatusMutation={updateOrderStatusMutation}
          refetchActiveOrders={refetchActiveOrders}
        />

        <View className="bg-base-300 p-4 rounded-3xl flex-1">
          <Text className="mb-4 font-bold capitalize opacity-80">Live Today's Orders</Text>
          <LiveOrderBoard liveOrderBoard={orderBoard} isLoading={isStatsLoading} role="driver" />
        </View>

        <AssignedOrdersFeed
          orders={filteredActiveOrders}
          isLoading={isActiveOrdersLoading}
          currencySymbol={currencySymbol || "£"}
          onViewOrder={(order) => setSelectedOrderDetails(order)}
        />

        {/* <WeeklyPerformance /> */}
      </RefreshableScrollView>

      <OrderDetailsDrawer
        order={selectedOrderDetails}
        visible={selectedOrderDetails !== null}
        onClose={() => setSelectedOrderDetails(null)}
        currencySymbol={currencySymbol || "£"}
      />
    </SafeAreaView>
  );
}
