// 1. React / React Native
import { useState } from "react";
import { View } from "react-native";

// 3. Shared components / context / hooks
import { PageTitle, ScreenContainer, ToggleBar } from "@/components/reuseable";

// 4. Feature components / hooks
import { CampaignsView, CouponsView } from "../components";

const TOGGLE_OPTIONS = [
  { id: "coupons", label: "Coupons" },
  { id: "campaigns", label: "Campaigns" },
];

export default function DiscountsAndCampaignsScreen() {
  const [activeTab, setActiveTab] = useState("coupons");
  const isCouponsTab = activeTab === "coupons";

  return (
    <ScreenContainer scrollable={false}>
      <PageTitle
        title="Discounts & Campaigns"
        icon="sell"
        description="Details about coupons and campaigns"
      />

      {/* Tab Toggle Selection */}
      <ToggleBar
        options={TOGGLE_OPTIONS}
        activeId={activeTab}
        onSelect={setActiveTab}
      />

      {/* Content Body with Independent Infinite Scrolling */}
      <View className="flex-1 ">
        {isCouponsTab ? <CouponsView /> : <CampaignsView />}
      </View>
    </ScreenContainer>
  );
}
