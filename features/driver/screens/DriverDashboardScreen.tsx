import React, { useState } from "react";
import { View, Text, Switch, ActivityIndicator, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useDriverDashboardStatsQuery } from "../hooks/queries/useDriverQueries";
import { useUpdateDriverStatusMutation } from "../hooks/mutations/useDriverMutations";
import KpiCard from "../components/KpiCard";
import LiveOrderBoard from "../components/LiveOrderBoard";
import DriverActiveOrder from "../components/DriverActiveOrder";
import WeeklyPerformance from "../components/WeeklyPerformance";

export default function DriverDashboardScreen() {
  const { token, user, logout } = useAuth();

  // Queries
  const { data: statsData, isLoading: isLoadingStats, refetch: refetchStats } = useDriverDashboardStatsQuery(token || "");
  const statusMutation = useUpdateDriverStatusMutation(token || "");

  // Local state for online toggle
  const [isOnline, setIsOnline] = useState(user?.driver_status === "available");

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

  const stats = statsData?.stats;
  const orderBoard = statsData?.order_board;

  return (
    <SafeAreaView className="flex-1 bg-base-100">
      {/* Premium Header */}
      <View className="px-6 pt-4 pb-5 bg-base-300 border-b border-base-200 shadow-sm flex-row justify-between items-center">
        <View>
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Welcome back
          </Text>
          <Text className="text-xl font-black text-neutral mt-0.5">
            Hi, {user?.first_name || user?.name || "Driver"}
          </Text>
        </View>

        {/* Header Action controls */}
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center bg-base-100 px-3 py-1.5 rounded-full border border-base-200 gap-2">
            <Text className="text-[9px] font-black text-slate-600 uppercase tracking-wider">
              {isOnline ? "Online" : "Offline"}
            </Text>
            {statusMutation.isPending ? (
              <ActivityIndicator size="small" color="#DC2D2A" />
            ) : (
              <Switch
                value={isOnline}
                onValueChange={handleStatusToggle}
                trackColor={{ false: "#d1d5db", true: "#36d399" }}
                thumbColor={isOnline ? "#ffffff" : "#f4f3f4"}
                ios_backgroundColor="#d1d5db"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="w-9 h-9 bg-rose-50 rounded-full border border-rose-100 items-center justify-center shadow-sm"
          >
            <Feather name="log-out" size={15} color="#DC2D2A" />
          </TouchableOpacity>
        </View>
      </View>

      <RefreshableScrollView
        onRefresh={handleRefresh}
        className="flex-1 px-6 py-6"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Metrics 2x2 grid */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <KpiCard
              title="Earnings"
              value={`£${(stats?.earnings ?? 0).toFixed(2)}`}
              iconName="dollar-sign"
              colorScheme="green"
              loading={isLoadingStats}
            />
          </View>
          <View className="flex-1">
            <KpiCard
              title="Deliveries"
              value={String(stats?.deliveries ?? 0)}
              iconName="shopping-bag"
              colorScheme="blue"
              loading={isLoadingStats}
            />
          </View>
        </View>

        <View className="flex-row gap-4 mb-6">
          <View className="flex-1">
            <KpiCard
              title="Rating"
              value={`${(stats?.avg_rating ?? 0).toFixed(1)} / 5.0`}
              iconName="star"
              colorScheme="yellow"
              loading={isLoadingStats}
            />
          </View>
          <View className="flex-1">
            <KpiCard
              title="Distance"
              value={`${(stats?.distance ?? 0).toFixed(1)} km`}
              iconName="map-pin"
              colorScheme="purple"
              loading={isLoadingStats}
            />
          </View>
        </View>

        {/* Active assigned task widget */}
        <View className="mb-6">
          <DriverActiveOrder />
        </View>

        {/* Today's live order board */}
        <View className="mb-6">
          <LiveOrderBoard orderBoardData={orderBoard} isLoading={isLoadingStats} />
        </View>

        {/* Weekly performance vertical bar chart */}
        <View className="mb-6">
          <WeeklyPerformance />
        </View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
