import {
  EmptyState,
  LoadingScreen,
  PageTitle,
  ScreenContainer,
  ToggleBar,
} from "@/components/reuseable";

import {
  useBusinessTimingQuery,
  useRestaurantQuery,
} from "@/features/restaurants/hooks/queries/useRestaurantQueries";
import { useAuth } from "@/src/context/AuthContext";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { BusinessInfoCard, BusinessScheduleCard } from "../components";

const TABS = [
  { id: "info", label: "Business Info" },
  { id: "schedule", label: "Schedule" },
];

export default function BusinessSettingsScreen() {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [activeTab, setActiveTab] = useState("info");

  // Query Hooks
  const {
    data: restaurantData,
    isLoading: isRestaurantLoading,
    refetch: refetchRestaurant,
  } = useRestaurantQuery(restaurantId || "");

  const {
    data: timingData,
    isLoading: isTimingLoading,
    refetch: refetchTiming,
  } = useBusinessTimingQuery(restaurantId || "");

  // Extract raw timings list and sort from Monday (1) to Sunday (0)
  const timingList = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(timingData)) {
      list = [...timingData];
    } else if (timingData && Array.isArray((timingData as any).data)) {
      list = [...(timingData as any).data];
    }

    // Sort Monday (1) -> Tuesday (2) -> ... -> Saturday (6) -> Sunday (0)
    return list.sort((a, b) => {
      const dayA = a.day === 0 ? 7 : a.day;
      const dayB = b.day === 0 ? 7 : b.day;
      return dayA - dayB;
    });
  }, [timingData]);

  // Handle Refreshing for current active tab
  const handleRefresh = async () => {
    if (activeTab === "info") {
      await refetchRestaurant();
    } else if (activeTab === "schedule") {
      await refetchTiming();
    }
  };

  // Determine current load state
  const isCurrentTabLoading =
    (activeTab === "info" && isRestaurantLoading) ||
    (activeTab === "schedule" && isTimingLoading);

  // Render content depending on activeTab
  const renderTabContent = () => {
    if (isCurrentTabLoading) {
      return (
        <View
          key="loading"
          className="flex-1 justify-center items-center py-20"
        >
          <LoadingScreen message="Loading settings..." useSafeArea={false} />
        </View>
      );
    }

    if (activeTab === "info") {
      if (!restaurantData) {
        return (
          <View
            key="empty-info"
            className="flex-1 justify-center items-center py-10 bg-base-100"
          >
            <EmptyState
              icon="error-outline"
              title="No Restaurant Info"
              description="Unable to load restaurant information at this time."
            />
          </View>
        );
      }
      return (
        <View key="info-content" className="flex-1">
          <BusinessInfoCard
            settings={restaurantData?.restaurant || restaurantData}
          />
        </View>
      );
    }

    if (activeTab === "schedule") {
      if (timingList.length === 0) {
        return (
          <View
            key="empty-schedule"
            className="flex-1 justify-center items-center py-10 bg-base-100"
          >
            <EmptyState
              icon="schedule"
              title="No Timings Available"
              description="No business hours or schedule timings are configured."
            />
          </View>
        );
      }
      return (
        <View key="schedule-content" className="flex-1">
          {timingList.map((dayTiming: any, index: number) => (
            <BusinessScheduleCard
              key={dayTiming.day ?? index}
              timing={dayTiming}
            />
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenContainer
      safeAreaEdges={["left", "right"]}
      onRefresh={handleRefresh}
    >
      <PageTitle title="Business Settings" icon="settings" />

      <ToggleBar options={TABS} activeId={activeTab} onSelect={setActiveTab} />

      <View className="mt-2">{renderTabContent()}</View>
    </ScreenContainer>
  );
}
