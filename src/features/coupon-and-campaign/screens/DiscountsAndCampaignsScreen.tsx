// 1. React / React Native
import { useState } from "react";

// 2. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 3. Shared components / context / hooks
import { PageTitle, ScreenContainer, ToggleBar } from "@/components/reuseable";
import { CAMPAIGN_KEYS, COUPON_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks";
import { getCurrencySymbol } from "@/utils";

// 4. Feature components / hooks
import { CampaignsView, CouponsView } from "../components";
import {
  useCampaignsQuery,
  useCouponsQuery,
} from "../hooks/queries/useDiscountQueries";

const TOGGLE_OPTIONS = [
  { id: "coupons", label: "Coupons" },
  { id: "campaigns", label: "Campaigns" },
];

export default function DiscountsAndCampaignsScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;
  const currencySymbol = getCurrencySymbol(user?.restaurant?.[0]?.currency);

  const [activeTab, setActiveTab] = useState("coupons");

  // Coupon search state
  const [couponSearchQuery, setCouponSearchQuery] = useState("");
  const debouncedCouponSearchQuery = useDebounce(couponSearchQuery, 500);

  // Campaign search and category states
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [selectedCampaignCategory, setSelectedCampaignCategory] = useState<
    string | null
  >(null);
  const debouncedCampaignSearchQuery = useDebounce(campaignSearchQuery, 500);

  // Fetch Coupons (Server-side search filter)
  const {
    data: couponsResponse,
    isLoading: isCouponsLoading,
    isRefetching: isCouponsRefetching,
  } = useCouponsQuery(restaurantId || "", 100, {
    search_key: debouncedCouponSearchQuery.trim() || undefined,
  });

  // Fetch Campaigns (Server-side category and search filters)
  const {
    data: campaignsResponse,
    isLoading: isCampaignsLoading,
    isRefetching: isCampaignsRefetching,
  } = useCampaignsQuery(restaurantId || "", 100, {
    search_key: debouncedCampaignSearchQuery.trim() || undefined,
    type: selectedCampaignCategory || undefined,
  });

  const coupons =
    couponsResponse?.pages?.flatMap((page) => page?.data ?? []) ?? [];

  const campaigns =
    campaignsResponse?.pages?.flatMap((page) => page?.data ?? []) ?? [];

  const handleRefresh = () => {
    if (activeTab === "coupons") {
      queryClient.invalidateQueries({ queryKey: COUPON_KEYS.lists() });
    } else {
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.lists() });
    }
  };

  const isCouponsTab = activeTab === "coupons";

  return (
    <ScreenContainer onRefresh={handleRefresh}>
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

      {/* Content Body */}
      {isCouponsTab ? (
        <CouponsView
          coupons={coupons}
          isLoading={isCouponsLoading || isCouponsRefetching}
          searchQuery={couponSearchQuery}
          setSearchQuery={setCouponSearchQuery}
          currencySymbol={currencySymbol}
        />
      ) : (
        <CampaignsView
          campaigns={campaigns}
          isLoading={isCampaignsLoading || isCampaignsRefetching}
          selectedCategory={selectedCampaignCategory}
          setSelectedCategory={setSelectedCampaignCategory}
          searchQuery={campaignSearchQuery}
          setSearchQuery={setCampaignSearchQuery}
        />
      )}
    </ScreenContainer>
  );
}
