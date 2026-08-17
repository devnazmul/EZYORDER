import {
  EmptyState,
  LoadingScreen,
  PageTitle,
  RefreshableScrollView,
  ToggleBar,
} from "@/components/reuseable";

import {
  BusinessInfoCard,
  BusinessScheduleCard,
  ExpenseTypeCard,
} from "../components";

import { useAuth } from "@/context/AuthContext";
import { useExpenseTypesQuery } from "@/features/owner/more/hooks/queries/useExpenseQueries";
import {
  useBusinessTimingQuery,
  useRestaurantQuery,
} from "@/features/owner/more/hooks/queries/useRestaurantQueries";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = [
  { id: "info", label: "Business Info" },
  { id: "schedule", label: "Schedule" },
  { id: "expense_types", label: "Expense Types" },
];

export default function BusinessSettingsScreen() {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [activeTab, setActiveTab] = useState("info");

  // Query Hooks
  const {
    data: restaurantData,
    isLoading: isRestaurantLoading,
    refetch: refetchRestaurant,
  } = useRestaurantQuery(token || "", restaurantId || "");

  const {
    data: timingData,
    isLoading: isTimingLoading,
    refetch: refetchTiming,
  } = useBusinessTimingQuery(token || "", restaurantId || "");

  const {
    data: expenseTypesData,
    isLoading: isExpenseTypesLoading,
    refetch: refetchExpenseTypes,
  } = useExpenseTypesQuery(token || "", restaurantId || "", 1000);

  // Extract raw timings list and sort from Monday (1) to Sunday (0)
  const timingList = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(timingData)) {
      list = [...timingData];
    } else if (timingData && Array.isArray(timingData.data)) {
      list = [...timingData.data];
    }

    // Sort Monday (1) -> Tuesday (2) -> ... -> Saturday (6) -> Sunday (0)
    return list.sort((a, b) => {
      const dayA = a.day === 0 ? 7 : a.day;
      const dayB = b.day === 0 ? 7 : b.day;
      return dayA - dayB;
    });
  }, [timingData]);

  // Extract raw expense types list
  const expenseTypesList = useMemo(() => {
    if (!expenseTypesData) return [];
    if (Array.isArray(expenseTypesData)) return expenseTypesData;
    if (Array.isArray(expenseTypesData.data)) return expenseTypesData.data;
    if (expenseTypesData.data && Array.isArray(expenseTypesData.data.data))
      return expenseTypesData.data.data;
    return [];
  }, [expenseTypesData]);

  // Handle Refreshing for current active tab
  const handleRefresh = async () => {
    if (activeTab === "info") {
      await refetchRestaurant();
    } else if (activeTab === "schedule") {
      await refetchTiming();
    } else if (activeTab === "expense_types") {
      await refetchExpenseTypes();
    }
  };

  // Determine current load state
  const isCurrentTabLoading =
    (activeTab === "info" && isRestaurantLoading) ||
    (activeTab === "schedule" && isTimingLoading) ||
    (activeTab === "expense_types" && isExpenseTypesLoading);

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

    if (activeTab === "expense_types") {
      if (expenseTypesList.length === 0) {
        return (
          <View
            key="empty-expenses"
            className="flex-1 justify-center items-center py-10 bg-base-100"
          >
            <EmptyState
              icon="receipt"
              title="No Expense Types"
              description="There are no expense types registered for this restaurant."
            />
          </View>
        );
      }
      return (
        <View key="expense-types-content" className="flex-1">
          {expenseTypesList.map((type: any) => (
            <ExpenseTypeCard key={type.id} expenseType={type} />
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <RefreshableScrollView
        onRefresh={handleRefresh}
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <PageTitle title="Business Settings" icon="settings" />

        <ToggleBar
          options={TABS}
          activeId={activeTab}
          onSelect={setActiveTab}
        />

        <View className="mt-2">{renderTabContent()}</View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
