import AppHeader from "@/components/AppHeader";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import DriverActiveOrder from "../components/DriverActiveOrder";
import DriverQuickStats from "../components/DriverQuickStats";
import LiveOrderBoard from "../components/LiveOrderBoard";
import WeeklyPerformance from "../components/WeeklyPerformance";
import { useUpdateDriverStatusMutation } from "../hooks/mutations/useDriverMutations";
import { useDriverDashboardStatsQuery } from "../hooks/queries/useDriverQueries";

export default function DriverDashboardScreen() {
  const { token, user, logout } = useAuth();
  console.log(user);
  // Queries
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isRefetching,
    refetch: refetchStats,
  } = useDriverDashboardStatsQuery(token || "");
  console.log(statsData);
  const statusMutation = useUpdateDriverStatusMutation(token || "");

  // Local state for online toggle
  const [isOnline, setIsOnline] = useState(user?.driver_status === "available");

  const currencySymbol = useMemo(() => {
    if (statsData) {
      return getCurrencySymbol(statsData.currency_symbol);
    }
  }, [statsData]);

  // Re-fetch all queries on pull-to-refresh
  const handleRefresh = async () => {
    await refetchStats();
  };

  const handleStatusToggle = () => {
    const nextStatus = isOnline ? "offline" : "available";
    statusMutation.mutate(nextStatus, {
      onSuccess: () => {
        setIsOnline(nextStatus === "available");
      },
      onError: (err: any) => {
        const errMsg = err?.data?.message || err?.message || "Failed to update availability status.";
        Alert.alert("Error", errMsg);
      },
    });
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
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
        {/* Welcome Header */}

        <WelcomeHeader user={user} />

        <DriverQuickStats
          isLoadingStats={isRefetching || isLoadingStats}
          stats={statsData?.stats}
          currencySymbol={currencySymbol}
          distanceUnit={statsData?.distance_unit}
        />

        <DriverActiveOrder />

        <LiveOrderBoard orderBoardData={orderBoard} isLoading={isLoadingStats} />

        <WeeklyPerformance />
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
