import AppHeader from "@/components/AppHeader";
import PageTitle from "@/components/reuseable/PageTitle";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverMyOrdersScreen() {
  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader />
      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <PageTitle
          title="My Orders"
          icon="receipt"
          description="Manage and track your assigned delivery transactions."
        />

        <View className="bg-base-300 rounded-xl p-6 border border-base-200 shadow-sm mt-4 items-center justify-center min-h-[200px]">
          <Text className="text-sm font-bold text-neutral">My Orders Placeholder</Text>
          <Text className="text-xs text-accent text-center mt-2">
            This screen will allow drivers to filter, search, and view historical delivery orders.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
