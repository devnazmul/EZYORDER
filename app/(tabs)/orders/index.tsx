import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";

export default function OrdersHub() {
  const { user } = useAuth();

  const menuOptions = [
    {
      id: "todays-orders",
      title: "Today's Orders",
      description: "Monitor live activity and incoming requests.",
      icon: "grid-view",
      route: "/orders/todays-orders" as const,
    },
    {
      id: "all-orders",
      title: "All Orders",
      description: "Access historical data and archived transactions.",
      icon: "list-alt",
      route: "/orders/all-orders" as const,
    },
    {
      id: "order-reports",
      title: "Order Reports",
      description: "Deep dive into sales trends and analytics.",
      icon: "bar-chart",
      route: "/orders/order-reports" as const,
    },
    {
      id: "kitchen-screen",
      title: "Kitchen Screen",
      description: "Real-time ticket management for the line.",
      icon: "restaurant",
      route: "/orders/kitchen-screen" as const,
    },
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      <AppHeader />

      {/* Main Content Scroll View */}
      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View className="mb-6">
          <Text className="text-2xl font-extrabold text-neutral mb-1">Orders</Text>
          <Text className="text-xs text-accent">Select an option to manage your orders operations.</Text>
        </View>

        {/* Action Cards Grid */}
        <View className="gap-y-4">
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => router.push(option.route)}
              activeOpacity={0.7}
              className="flex-row items-center p-5 bg-base-300 rounded-xl border border-base-200 shadow-sm"
            >
              {/* Icon Circular Wrapper */}
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                <MaterialIcons name={option.icon as any} size={24} color="#DC2D2A" />
              </View>

              {/* Text Information */}
              <View className="flex-1 pr-2">
                <Text className="text-md font-bold text-neutral mb-0.5">{option.title}</Text>
                <Text className="text-xs text-accent leading-5" numberOfLines={2}>
                  {option.description}
                </Text>
              </View>

              {/* Chevron Right indicator */}
              <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
