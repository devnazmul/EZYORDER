import MenuCard from "@/components/reuseable/MenuCard";
import PageTitle from "@/components/reuseable/PageTitle";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportsHub() {
  const [toast, setToast] = useState<string | null>(null);

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
      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title Section */}
        <PageTitle
          title="Reports"
          description="Select an option to manage your reports operations."
          icon="bar-chart"
        />
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
      </ScrollView>
    </SafeAreaView>
  );
}
