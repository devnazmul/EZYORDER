// 1. React / React Native
import { useState } from "react";
import { View } from "react-native";

// 4. Shared components
import { PageTitle, ScreenContainer, ToggleBar } from "@/components/reuseable";

// 5. Feature components
import { PartnersSaleView, PartnersView } from "../components";

const TOGGLE_OPTIONS = [
  { id: "partners", label: "Partners", icon: "handshake" as const },
  { id: "partner_sales", label: "Partners Sale", icon: "trending-up" as const },
];

export default function PartnersScreen() {
  const [activeTab, setActiveTab] = useState("partners");
  const isPartnersTab = activeTab === "partners";

  return (
    <ScreenContainer scrollable={false}>
      {/* Page Title */}
      <PageTitle
        title="Restaurant Partners"
        icon="handshake"
        description="Details of Partners and their sales"
      />

      {/* Toggle Bar */}
      <ToggleBar
        options={TOGGLE_OPTIONS}
        activeId={activeTab}
        onSelect={setActiveTab}
        containerClassName="mb-6"
      />

      {/* Conditional Content */}
      <View className="flex-1">
        {isPartnersTab ? <PartnersView /> : <PartnersSaleView />}
      </View>
    </ScreenContainer>
  );
}
