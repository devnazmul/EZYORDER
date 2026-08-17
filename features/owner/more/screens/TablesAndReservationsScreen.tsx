import { PageTitle, ToggleBar } from "@/components/reuseable";
import { ReservationsView, TablesView } from "../components";

import { WP } from "@/utils/getResponsiveSizes";
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

  const header = (
    <View className="pt-4">
      {/* Reusable Page Title */}
      <PageTitle
        title="Tables & Reservations"
        icon="table-restaurant"
        description={`See details of ${activeTab == "tables" ? "Tables" : "Reservations"}`}
      />

      {/* Toggle Bar */}
      <ToggleBar
        options={TOGGLE_OPTIONS}
        activeId={activeTab}
        onSelect={setActiveTab}
        containerClassName="mb-6"
      />
    </View>
  );

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <View style={{ paddingHorizontal: WP("4%") }} className="flex-1">
        {/* Conditional Content */}
        {isTablesTab ? (
          <TablesView header={header} />
        ) : (
          <ReservationsView header={header} />
        )}
      </View>
    </SafeAreaView>
  );
}
