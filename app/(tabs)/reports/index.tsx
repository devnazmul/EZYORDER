import AppHeader from "@/components/AppHeader";
import WeeklyInsightsCard from "@/components/reports/WeeklyInsightsCard";
import MenuCard from "@/components/reuseable/MenuCard";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportsHub() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleViewInsight = () => {
    setToast("Weekly kitchen efficiency insight loaded successfully!");
  };

  const menuOptions = [
    {
      id: "sales",
      title: "Sales Report",
      description: "Revenue tracking",
      icon: "bar-chart" as const,
      route: "/reports/sales" as const,
    },
    {
      id: "customers",
      title: "Customers",
      description: "Client analytics",
      icon: "group" as const,
      route: "/reports/customers" as const,
    },
  ];

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader />

      {/* Elegant Toast notification for insights */}
      {toast && (
        <View className="absolute top-12 left-4 right-4 z-50 p-4 rounded-lg shadow-lg flex-row items-center border bg-green-50 border-green-200">
          <MaterialIcons name="check-circle" size={24} color="#16a34a" />
          <Text className="ml-3 font-semibold flex-1 text-sm text-green-800">{toast}</Text>
        </View>
      )}

      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title Section */}
        <View className="mb-6">
          <Text className="text-2xl font-extrabold text-neutral mb-1">Reports</Text>
          <Text className="text-xs text-accent">Select an option to manage your reports operations.</Text>
        </View>

        {/* Menu Cards Stack */}
        <View className="gap-y-4 mb-6">
          {menuOptions.map((option) => (
            <MenuCard
              key={option.id}
              title={option.title}
              description={option.description}
              iconName={option.icon}
              onPress={() => router.push(option.route)}
            />
          ))}
        </View>

        {/* Weekly Insights Custom Banner Component */}
        <WeeklyInsightsCard onViewInsight={handleViewInsight} />
      </ScrollView>
    </SafeAreaView>
  );
}
