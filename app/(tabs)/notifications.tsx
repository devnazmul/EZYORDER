import AppHeader from "@/components/AppHeader";
import NotificationCard from "@/components/NotificationCard";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterChips from "@/components/reuseable/FilterChips";
import LoadingScreen from "@/components/reuseable/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import {
  useMarkAllAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
  useNotificationUnreadCountQuery,
} from "@/hooks/useNotificationQueries";
import React, { useState } from "react";
import { RefreshControl, SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const { token } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch queries
  const { data: notifications = [], isLoading, isRefetching, refetch } = useNotificationsQuery(token || "");
  const { data: unreadCountData = { count: 0 } } = useNotificationUnreadCountQuery(token || "");
  const unreadCount = unreadCountData?.count || 0;

  console.log("notification", notifications);

  // Mutations
  const markAsReadMutation = useMarkNotificationAsReadMutation(token || "");
  const markAllAsReadMutation = useMarkAllAsReadMutation(token || "");

  const handleNotificationPress = async (notification: any) => {
    // 1. Mark as read on backend if it's currently unread
    if (notification.status !== "read") {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // 2. Future routing placeholder
    console.log(`Notification clicked: ${notification.id}. Routing placeholder.`);
    /*
    switch (notification.type) {
      case "order":
        router.push(`/orders/all-orders?search=${notification.orderId || ""}`);
        break;
      case "promotion":
        router.push("/home");
        break;
      default:
        break;
    }
    */
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  // Safe date parsing helper for DD-MM-YYYY formats
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split(" ");
    if (parts.length >= 1) {
      const dateParts = parts[0].split("-");
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);

        let hour = 0;
        let minute = 0;
        let second = 0;

        if (parts[1]) {
          const timeParts = parts[1].split(":");
          if (timeParts.length >= 2) {
            hour = parseInt(timeParts[0], 10);
            minute = parseInt(timeParts[1], 10);
            if (timeParts[2]) {
              second = parseInt(timeParts[2], 10);
            }
          }
        }
        return new Date(year, month, day, hour, minute, second);
      }
    }
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? null : fallback;
  };

  // Group notifications by date
  const groupNotifications = (list: any[]) => {
    const todayList: any[] = [];
    const yesterdayList: any[] = [];
    const olderList: any[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    list.forEach((item) => {
      if (!item.created_at) {
        olderList.push(item);
        return;
      }
      const parsedDate = parseDate(item.created_at);
      if (!parsedDate) {
        olderList.push(item);
        return;
      }
      const itemDate = new Date(parsedDate);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === today.getTime()) {
        todayList.push(item);
      } else if (itemDate.getTime() === yesterday.getTime()) {
        yesterdayList.push(item);
      } else {
        olderList.push(item);
      }
    });

    return {
      Today: todayList,
      Yesterday: yesterdayList,
      Older: olderList,
    };
  };

  if (isLoading) {
    return <LoadingScreen key="loading" message="Loading notifications..." />;
  }

  // Filter items
  const filteredNotifications = notifications.filter((item: any) => {
    if (activeFilter === "all") return true;
    const type = (item.type || item.sender_type || "").toLowerCase().trim();
    return type === activeFilter;
  });

  const groups = groupNotifications(filteredNotifications);
  const totalFilteredCount = filteredNotifications.length;

  const sections = Object.entries(groups)
    .filter(([_, items]) => items.length > 0)
    .map(([title, data]) => ({ title, data }));

  return (
    <SafeAreaView key="loaded" edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader />

      <SectionList
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#DC2D2A"
            colors={["#DC2D2A"]}
          />
        }
        ListHeaderComponent={
          <View className="mb-4">
            {/* Section Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1 pr-4">
                <Text className="text-xl font-bold text-neutral">Notifications</Text>
                <Text className="text-xs text-accent mt-1">Stay updated with your restaurant's activity</Text>
              </View>
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={handleMarkAllAsRead}
                  className="px-3 py-1.5 rounded-lg bg-primary/10"
                >
                  <Text className="text-xs font-bold text-primary">Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Chips row */}
            <FilterChips
              chips={[
                { id: "all", label: "All" },
                { id: "system", label: "System" },
                { id: "driver", label: "Driver" },
              ]}
              selectedId={activeFilter}
              onSelect={setActiveFilter}
              containerClassName="mb-2"
            />
          </View>
        }
        renderSectionHeader={({ section: { title } }) => (
          <View className="mb-3 mt-4 px-1 bg-base-100 py-1">
            <Text className="text-xs font-bold text-accent uppercase tracking-wider">{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <NotificationCard key={item.id} notification={item} onPress={() => handleNotificationPress(item)} />
        )}
        ListEmptyComponent={
          notifications.length === 0 ? (
            <EmptyState description="You have no notifications yet" pyClassName="py-12" />
          ) : totalFilteredCount === 0 ? (
            <EmptyState description="No notifications match the filter" pyClassName="py-12" />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
