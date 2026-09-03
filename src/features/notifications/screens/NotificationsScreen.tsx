import Button from "@/components/reuseable/Button";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterChips from "@/components/reuseable/FilterChips";
import PageTitle from "@/components/reuseable/PageTitle";
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { parseDate } from "@/utils/parseDate";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationCard from "../components/NotificationCard";
import NotificationCardSkeleton from "../components/skeletons/NotificationCardSkeleton";
import {
  useMarkAllAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
} from "../hooks/queries/useNotificationQueries";

export default function Notifications() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch single query returning both notifications list & unread count
  const {
    data: notificationData,
    isLoading,
    isRefetching,
    refetch,
  } = useNotificationsQuery();
  const notifications = notificationData?.list || [];
  const unreadCount = notificationData?.unreadCount || 0;

  // Mutations
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  const handleNotificationPress = async (notification: any) => {
    // 1. Mark as read on backend if it's currently unread
    const statusStr = (notification.status || "").toLowerCase().trim();
    if (statusStr === "unread") {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // 2. Perform routing based on notification_link or dynamic fields
    const link = notification.notification_link;
    if (link) {
      if (link.startsWith("order/")) {
        const orderId = link.split("/")[1];
        router.push(`/orders/all-orders?search=${orderId}`);
      } else {
        try {
          router.push(link);
        } catch (e) {
          console.error("Failed to route link:", link, e);
        }
      }
    } else if (notification.entity_id) {
      // Fallback fallback if notification has raw entity_id
      router.push(`/orders/all-orders?search=${notification.entity_id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
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
    <SafeAreaView
      key="loaded"
      edges={["left", "right"]}
      className="flex-1 bg-base-100"
    >
      <View style={{ paddingHorizontal: WP("4%") }} className="flex-1 pt-4">
        {/* Page Header (standalone full-width) */}
        <PageTitle
          title="Notifications"
          icon="notifications"
          description="Stay updated with your restaurant's activity"
        />

        {/* Filter Chips row */}
        <FilterChips
          chips={[
            { id: "all", label: "All" },
            { id: "system", label: "System" },
            { id: "driver", label: "Driver" },
          ]}
          selectedId={activeFilter}
          onSelect={setActiveFilter}
          containerClassName="mb-3"
        />

        {/* Action row */}
        {unreadCount > 0 && (
          <View className="items-end mb-3">
            <Button
              label="Mark all as read"
              onPress={handleMarkAllAsRead}
              variant="primary"
              containerClassName=" px-4 rounded-lg"
              containerStyle={{ width: "auto", alignSelf: "flex-end" }}
            />
          </View>
        )}

        {isLoading || isRefetching ? (
          <NotificationCardSkeleton />
        ) : (
          <SectionList
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
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
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            renderSectionHeader={({ section: { title } }) => (
              <View className="mb-3 px-1 bg-base-100 ">
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className=" font-semibold text-accent capitalize tracking-wide"
                >
                  {title}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onPress={() => handleNotificationPress(item)}
              />
            )}
            ListEmptyComponent={
              notifications.length === 0 ? (
                <EmptyState
                  description="You have no notifications yet"
                  pyClassName="py-12"
                />
              ) : totalFilteredCount === 0 ? (
                <EmptyState
                  description="No notifications match the filter"
                  pyClassName="py-12"
                />
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
