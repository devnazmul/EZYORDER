import { useAuth } from "@/context/AuthContext";
import { useNotificationUnreadCountQuery } from "@/hooks/useNotificationQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function PulseDot() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2.2,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [pulseAnim, opacityAnim]);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Pulsing ring */}
      <Animated.View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#DC2D2A",
          transform: [{ scale: pulseAnim }],
          opacity: opacityAnim,
          position: "absolute",
        }}
      />
      {/* Solid inner dot */}
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#DC2D2A",
          borderWidth: 1,
          borderColor: "#FFFFFF",
          position: "absolute",
        }}
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { token, isLoading } = useAuth();

  const { data } = useNotificationUnreadCountQuery(token || "");

  const unreadCount = data?.count || 0;
  const hasUnread = unreadCount > 0;

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
            <View style={{ width: 24, height: 24 }}>
              <MaterialIcons name="notifications" size={24} color={color} />
              {hasUnread && <PulseDot />}
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
