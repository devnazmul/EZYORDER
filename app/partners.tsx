import AppHeader from "@/components/AppHeader";
import PageTitle from "@/components/reuseable/PageTitle";
import ToggleBar from "@/components/reuseable/ToggleBar";
import PartnersView from "@/components/partners/PartnersView";
import PartnersSaleView from "@/components/partners/PartnersSaleView";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOGGLE_OPTIONS = [
  { id: "partners", label: "Partners", icon: "handshake" as const },
  { id: "partner_sales", label: "Partners Sale", icon: "trending-up" as const },
];

export default function PartnersScreen() {
  const [activeTab, setActiveTab] = useState("partners");
  const isPartnersTab = activeTab === "partners";

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

      <View className="flex-1 px-4 py-4">
        {/* Page Title */}
        <PageTitle title="Partners Hub" icon="handshake" />

        {/* Toggle Bar */}
        <ToggleBar
          options={TOGGLE_OPTIONS}
          activeId={activeTab}
          onSelect={setActiveTab}
          containerClassName="mb-6"
        />

        {/* Conditional Content */}
        {isPartnersTab ? (
          <PartnersView />
        ) : (
          <PartnersSaleView />
        )}
      </View>
    </SafeAreaView>
  );
}
