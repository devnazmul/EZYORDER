import MenuCard from "@/components/reuseable/MenuCard";
import PageTitle from "@/components/reuseable/PageTitle";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      id: "kitchen-screen",
      title: "Kitchen Screen",
      description: "Real-time ticket management for the line.",
      icon: "restaurant",
      route: "/orders/kitchen-screen" as const,
    },
  ];

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} className="flex-1 bg-base-100">

      {/* Main Content Scroll View */}
      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}

        <PageTitle
          title="Orders"
          icon="receipt"
          description="Select an option to manage your orders operations."
        />

        {/* Action Cards Grid */}
        <View className="gap-y-4">
          {menuOptions.map((option) => (
            <MenuCard
              key={option.id}
              title={option.title}
              description={option.description}
              iconName={option.icon as any}
              onPress={() => router.push(option.route)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
