import AppHeader from "@/components/AppHeader";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { useOwnerProfileQuery } from "@/hooks/useUserQueries";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import DriverActiveOrder from "../components/DriverActiveOrder";
import DriverQuickStats from "../components/DriverQuickStats";
import { useUpdateDriverOrderStatusMutation } from "../hooks/mutations/useDriverMutations";
import {
  useDriverActiveAssignedOrdersQuery,
  useDriverDashboardStatsQuery,
} from "../hooks/queries/useDriverQueries";

export default function DriverDashboardScreen() {
  const { token, user, logout } = useAuth();

  // Queries
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isRefetching,
    refetch: refetchStats,
  } = useDriverDashboardStatsQuery(token || "");

  const {
    data: activeOrders,
    isLoading: isLoadingActiveOrders,
    refetch: refetchActiveOrders,
  } = useDriverActiveAssignedOrdersQuery(token || "");

  const { data: profileData, refetch: refetchProfile } = useOwnerProfileQuery(token || "", user?.id || null);

  const profileUser = useMemo(() => {
    if (!profileData) return null;
    return profileData.user || profileData.data?.user || null;
  }, [profileData]);

  const activeUser = profileUser || user;

  const updateOrderStatusMutation = useUpdateDriverOrderStatusMutation(token || "");

  const currencySymbol = useMemo(() => {
    if (statsData) {
      return getCurrencySymbol(statsData.currency_symbol);
    }
  }, [statsData]);

  // Re-fetch all queries on pull-to-refresh
  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchActiveOrders(), refetchProfile()]);
  };

  const orderBoard = statsData?.order_board;

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader />

      <RefreshableScrollView
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 60, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader user={activeUser} />

        <DriverQuickStats
          isLoadingStats={isRefetching || isLoadingStats}
          stats={statsData?.stats}
          currencySymbol={currencySymbol}
          distanceUnit={statsData?.distance_unit}
        />

        <DriverActiveOrder
          ordersList={activeOrders}
          isLoading={isRefetching || isLoadingActiveOrders}
          updateStatusMutation={updateOrderStatusMutation}
        />

        {/* <LiveOrderBoard orderBoardData={orderBoard} isLoading={isLoadingStats} /> */}

        {/* <WeeklyPerformance /> */}
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
