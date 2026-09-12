// 1. React / React Native
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

// 2. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 3. Shared components / context / hooks
import { EmptyState, SearchBar } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { CAMPAIGN_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks";

// 4. Feature components / hooks
import { useCampaignsQuery } from "../hooks/queries/useDiscountQueries";
import CampaignCard from "./CampaignCard";
import CampaignCategoryCard from "./CampaignCategoryCard";
import CampaignCategoryHeader from "./CampaignCategoryHeader";
import CampaignCardSkeleton from "./skeletons/CampaignCardSkeleton";

// 5. Constants/utils
import {
  CAMPAIGN_CATEGORY_LIST,
  getCampaignCategoryConfig,
} from "../utils/getCampaignCategoryConfig";

export default function CampaignsView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: campaignsResponse,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCampaignsQuery(restaurantId || "", 20, {
    search_key: debouncedSearchQuery.trim() || undefined,
    type: selectedCategory || undefined,
  });

  const campaigns =
    campaignsResponse?.pages?.flatMap((page) => page?.data ?? []) ?? [];

  const selectedCategoryDetail = getCampaignCategoryConfig(selectedCategory);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEYS.lists() });
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="mt-3">
        <CampaignCardSkeleton count={2} />
      </View>
    );
  };

  // 1. RENDER CATEGORY LIST SELECTION (Initial State)
  if (selectedCategory === null) {
    return (
      <View className="gap-y-3">
        {CAMPAIGN_CATEGORY_LIST.map((category) => (
          <CampaignCategoryCard
            key={category.id}
            category={category}
            onSelect={(val) => {
              setSelectedCategory(val);
              setSearchQuery("");
            }}
          />
        ))}
      </View>
    );
  }

  // 2. RENDER OFFERS LIST FOR SELECTED CATEGORY
  return (
    <FlatList
      data={isLoading && !isRefetching ? [] : campaigns}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-y-3"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <CampaignCategoryHeader
            categoryName={selectedCategoryDetail?.name}
            onBack={() => setSelectedCategory(null)}
          />

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search campaigns in this category..."
          />
        </View>
      }
      renderItem={({ item }) => <CampaignCard campaign={item} />}
      ListEmptyComponent={
        isLoading && !isRefetching ? (
          <CampaignCardSkeleton count={3} />
        ) : (
          <EmptyState
            icon="event-note"
            title="No Offers Found"
            description={
              searchQuery
                ? "No campaign offers match your search query."
                : "There are no active offers in this campaign category."
            }
          />
        )
      }
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    />
  );
}
