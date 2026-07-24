import CampaignsView from "@/components/discounts/CampaignsView";
import CouponsView from "@/components/discounts/CouponsView";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useCampaignsQuery, useCouponsQuery } from "@/hooks/useDiscountQueries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOGGLE_OPTIONS = [
  { id: "coupons", label: "Coupons" },
  { id: "campaigns", label: "Campaigns" },
];

export default function DiscountsAndCampaignsScreen() {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [activeTab, setActiveTab] = useState("coupons");

  // Coupon search state
  const [couponSearchQuery, setCouponSearchQuery] = useState("");
  const debouncedCouponSearchQuery = useDebounce(couponSearchQuery, 500);

  // Campaign search and category states
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [selectedCampaignCategory, setSelectedCampaignCategory] = useState<string | null>(null);
  const debouncedCampaignSearchQuery = useDebounce(campaignSearchQuery, 500);

  // Fetch Coupons (Server-side search filter)
  const {
    data: couponsResponse,
    isLoading: isCouponsLoading,
    refetch: refetchCoupons,
  } = useCouponsQuery(token || "", restaurantId || "", 100, {
    search_key: debouncedCouponSearchQuery.trim() || undefined,
  });

  // Fetch Campaigns (Server-side category and search filters)
  const {
    data: campaignsResponse,
    isLoading: isCampaignsLoading,
    refetch: refetchCampaigns,
  } = useCampaignsQuery(token || "", restaurantId || "", 100, {
    search_key: debouncedCampaignSearchQuery.trim() || undefined,
    type: selectedCampaignCategory || undefined,
  });

  // Safely extract coupons array from response envelope
  const coupons = useMemo(() => {
    if (!couponsResponse) return [];
    if (Array.isArray(couponsResponse)) return couponsResponse;
    if (Array.isArray(couponsResponse.data)) return couponsResponse.data;
    if (couponsResponse.data && Array.isArray(couponsResponse.data.data)) return couponsResponse.data.data;
    return [];
  }, [couponsResponse]);

  // Safely extract campaigns array from response envelope
  const campaigns = useMemo(() => {
    if (!campaignsResponse) return [];
    if (Array.isArray(campaignsResponse)) return campaignsResponse;
    if (Array.isArray(campaignsResponse.data)) return campaignsResponse.data;
    if (campaignsResponse.data && Array.isArray(campaignsResponse.data.data))
      return campaignsResponse.data.data;
    return [];
  }, [campaignsResponse]);

  const handleRefresh = async () => {
    if (activeTab === "coupons") {
      await refetchCoupons();
    } else {
      await refetchCampaigns();
    }
  };

  const isCouponsTab = activeTab === "coupons";

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      {/* App Header with Back Button */}

      <RefreshableScrollView
        className="flex-1 px-4 py-4"
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Page Header Title */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="bg-primary-container/10 p-1.5 rounded-lg">
              <MaterialIcons name="sell" size={18} color="#DC2D2A" />
            </View>
            <Text className="text-lg font-black text-neutral uppercase tracking-tight">
              Discounts & Campaigns
            </Text>
          </View>
        </View>

        {/* Tab Toggle Selection */}
        <ToggleBar options={TOGGLE_OPTIONS} activeId={activeTab} onSelect={setActiveTab} />

        {/* Content Body */}
        {isCouponsTab ? (
          <CouponsView
            coupons={coupons}
            isLoading={isCouponsLoading}
            searchQuery={couponSearchQuery}
            setSearchQuery={setCouponSearchQuery}
          />
        ) : (
          <CampaignsView
            campaigns={campaigns}
            isLoading={isCampaignsLoading}
            selectedCategory={selectedCampaignCategory}
            setSelectedCategory={setSelectedCampaignCategory}
            searchQuery={campaignSearchQuery}
            setSearchQuery={setCampaignSearchQuery}
          />
        )}
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
