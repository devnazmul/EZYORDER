import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/context/AuthContext";
import { useNotificationsQuery } from "@/features/owner/notifications/hooks/queries/useNotificationQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs, usePathname } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function NotificationBadge({ count }: { count: number }) {
  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? "99+" : String(count);

  return (
    <View
      style={{
        position: "absolute",
        top: -4,
        right: -7,
        backgroundColor: "#DC2D2A",
        minWidth: 17,
        height: 16,
        borderRadius: 9999,
        paddingHorizontal: 1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 9,
          fontWeight: "bold",
          textAlign: "center",
          includeFontPadding: false,
        }}
      >
        {displayCount}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { token, user } = useAuth();
  const pathname = usePathname();

  const { data: notificationData } = useNotificationsQuery();
  const unreadCount = Number(notificationData?.unreadCount || 0);

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = (user?.type || "").toLowerCase().trim();
  if (role === "driver") {
    return <Redirect href="/(driver)" />;
  }

  const renderTabBarLabel = (title: string) => {
    const TabBarLabel = ({ color }: { color: string }) => (
      <Text
        style={{
          color,
          fontSize: 10.5,
          fontWeight: "600",
          marginTop: 2,
          textAlign: "center",
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {title}
      </Text>
    );
    TabBarLabel.displayName = `TabBarLabel(${title})`;
    return TabBarLabel;
  };

  const rootRoutes = [
    "/home",
    "/orders",
    "/reports",
    "/notifications",
    "/more",
  ];
  const showBackButton = !rootRoutes.includes(pathname);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBackButton={showBackButton} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#DC2D2A",
          tabBarInactiveTintColor: "#6E6E6E",
          tabBarStyle: {
            height: 60 + (insets.bottom > 0 ? insets.bottom + 8 : 12),
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#e2e2e2",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            elevation: 8,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 12,
            paddingTop: 12,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Dashboard",
            tabBarLabel: renderTabBarLabel("Dashboard"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="dashboard" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarLabel: renderTabBarLabel("Orders"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="receipt" size={24} color={color} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Explicitly navigate to the Orders root index screen when clicking the tab
              e.preventDefault();
              navigation.navigate("orders", { screen: "index" });
            },
          })}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: "Reports",
            tabBarLabel: renderTabBarLabel("Reports"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="bar-chart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarLabel: renderTabBarLabel("Notifications"),
            tabBarIcon: ({ color }) => (
              <View style={{ width: 24, height: 24 }}>
                <MaterialIcons name="notifications" size={24} color={color} />
                <NotificationBadge count={unreadCount} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarLabel: renderTabBarLabel("More"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="more-horiz" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
