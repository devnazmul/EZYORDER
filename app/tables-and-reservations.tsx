import AppHeader from "@/components/AppHeader";
import PageTitle from "@/components/reuseable/PageTitle";
import ToggleBar from "@/components/reuseable/ToggleBar";
import ReservationsView from "@/components/tables-reservations/ReservationsView";
import TablesView from "@/components/tables-reservations/TablesView";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOGGLE_OPTIONS = [
  { id: "tables", label: "Tables", icon: "table-restaurant" as const },
  { id: "reservations", label: "Reservations", icon: "event" as const },
];

export default function TablesAndReservations() {
  const [activeTab, setActiveTab] = useState("tables");
  const isTablesTab = activeTab === "tables";

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

      <View className="flex-1 px-4 py-4">
        {/* Reusable Page Title */}
        <PageTitle title="Tables & Reservations" icon="table-restaurant" />

        {/* Toggle Bar */}
        <ToggleBar
          options={TOGGLE_OPTIONS}
          activeId={activeTab}
          onSelect={setActiveTab}
          containerClassName="mb-6"
        />

        {/* Conditional Content */}
        {isTablesTab ? (
          <TablesView />
        ) : (
          <ReservationsView />
        )}
      </View>
    </SafeAreaView>
  );
}
