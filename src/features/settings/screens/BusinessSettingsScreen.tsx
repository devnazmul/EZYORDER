// 1. React / React Native
import React, { useState } from "react";
import { View } from "react-native";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components & context
import {
  EmptyState,
  PageTitle,
  ScreenContainer,
  ToggleBar,
} from "@/components/reuseable";
import { BUSINESS_TIMING_KEYS, RESTAURANT_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/context/AuthContext";

// 5. Feature components & services (via Barrel exports)
import {
  RestaurantService,
  useBusinessTimingQuery,
  useRestaurantQuery,
} from "@/features/restaurants";
import {
  BusinessInfoCard,
  BusinessInfoCardSkeleton,
  BusinessScheduleCard,
  BusinessScheduleCardSkeleton,
} from "../components";

// 6. Types

const TABS = [
  { id: "info", label: "Business Info" },
  { id: "schedule", label: "Schedule" },
];

export default function BusinessSettingsScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [activeTab, setActiveTab] = useState("info");

  // Query Hooks
  const {
    data: restaurantData,
    isLoading: isRestaurantLoading,
    isRefetching: isRestaurantRefetching,
    isError: isRestaurantError,
    error: restaurantError,
  } = useRestaurantQuery({ restaurant_id: restaurantId });

  const {
    data: timingData,
    isLoading: isTimingLoading,
    isRefetching: isTimingRefetching,
    isError: isTimingError,
    error: timingError,
  } = useBusinessTimingQuery({ restaurant_id: restaurantId });

  // Extract raw timings list and sort from Monday (1) to Sunday (0) via RestaurantService
  const timingList = RestaurantService.sortBusinessTimings(timingData);

  // Handle Refreshing for current active tab via Query Key Invalidation
  const handleRefresh = async () => {
    if (activeTab === "info") {
      await queryClient.invalidateQueries({
        queryKey: RESTAURANT_KEYS.detail({ restaurant_id: restaurantId }),
      });
    } else if (activeTab === "schedule") {
      await queryClient.invalidateQueries({
        queryKey: BUSINESS_TIMING_KEYS.detail({ restaurant_id: restaurantId }),
      });
    }
  };

  // Render Info Tab Content
  const renderInfoTab = () => {
    if (isRestaurantLoading || isRestaurantRefetching) {
      return (
        <View key="loading-info" className="flex-1">
          <BusinessInfoCardSkeleton />
        </View>
      );
    }

    if (isRestaurantError) {
      return (
        <View
          key="error-info"
          className="flex-1 justify-center items-center py-10"
        >
          <EmptyState
            icon="error-outline"
            title="Failed to Load Restaurant Info"
            description={
              restaurantError instanceof Error
                ? restaurantError.message
                : "An unexpected error occurred while loading business settings."
            }
          />
        </View>
      );
    }

    if (!restaurantData) {
      return (
        <View
          key="empty-info"
          className="flex-1 justify-center items-center py-10"
        >
          <EmptyState
            icon="info-outline"
            title="No Restaurant Info Found"
            description="No business settings or info details available for this restaurant."
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
  };

  // Render Schedule Tab Content
  const renderScheduleTab = () => {
    if (isTimingLoading || isTimingRefetching) {
      return (
        <View key="loading-schedule" className="flex-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <BusinessScheduleCardSkeleton key={`schedule-skeleton-${index}`} />
          ))}
        </View>
      );
    }

    if (isTimingError) {
      return (
        <View
          key="error-schedule"
          className="flex-1 justify-center items-center py-10"
        >
          <EmptyState
            icon="error-outline"
            title="Failed to Load Operating Hours"
            description={
              timingError instanceof Error
                ? timingError.message
                : "An unexpected error occurred while loading schedule timings."
            }
          />
        </View>
      );
    }

    if (timingList.length === 0) {
      return (
        <View
          key="empty-schedule"
          className="flex-1 justify-center items-center py-10"
        >
          <EmptyState
            icon="schedule"
            title="No Operating Hours Found"
            description="No business hours or schedule timings are configured for this restaurant."
          />
        </View>
      );
    }

    return (
      <View key="schedule-content" className="flex-1">
        {timingList.map((dayTiming, index) => (
          <BusinessScheduleCard
            key={dayTiming.day ?? index}
            timing={dayTiming}
          />
        ))}
      </View>
    );
  };

  return (
    <ScreenContainer
      safeAreaEdges={["left", "right"]}
      onRefresh={handleRefresh}
    >
      <PageTitle
        title="Business Settings"
        icon="settings"
        description="Details about business and services"
      />

      <ToggleBar options={TABS} activeId={activeTab} onSelect={setActiveTab} />

      <View>
        {activeTab === "info" ? renderInfoTab() : renderScheduleTab()}
      </View>
    </ScreenContainer>
  );
}
