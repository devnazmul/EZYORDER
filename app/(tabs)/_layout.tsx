import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, Redirect } from "expo-router";
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 bg-base-100 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="mt-4 text-xs font-semibold text-accent">Loading Application...</Text>
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <MaterialIcons name="receipt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => <MaterialIcons name="bar-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialIcons name="notifications" size={24} color={color} />
              <View className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => <MaterialIcons name="more-horiz" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
