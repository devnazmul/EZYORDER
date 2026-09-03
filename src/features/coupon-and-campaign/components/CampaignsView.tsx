import { EmptyState, SearchBar } from "@/components/reuseable";
import CampaignCard from "./CampaignCard";

import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CampaignsViewProps {
  campaigns: any[];
  isLoading: boolean;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CAMPAIGN_CATEGORIES = [
  {
    id: "1",
    name: "Buy One Get One Free (BOGOF)",
    value: "buy_one_get_one_same",
    icon: "card-giftcard" as const,
    description:
      "Buy one get one free deals. Boost your sales volume with high-value item pairings.",
    color: "#DC2D2A",
    bgColor: "bg-primary/5",
  },
  {
    id: "2",
    name: "Buy One Item and Get Another Item Free",
    value: "buy_one_get_one_other",
    icon: "view-carousel" as const,
    description:
      "Special bundle offers. Mix and match related products to increase basket size.",
    color: "#00677F",
    bgColor: "bg-secondary/5",
  },
  {
    id: "3",
    name: "Spend Certain Amount And Get Discount",
    value: "spend_certain_amount",
    icon: "shopping-bag" as const,
    description:
      "Tiered spending rewards. Incentivize higher spending with progressive discounts.",
    color: "#D97706",
    bgColor: "bg-amber-500/5",
  },
  {
    id: "4",
    name: "Overall Store Discount (Percentage-Based)",
    value: "menu_discount",
    icon: "percent" as const,
    description:
      "Store-wide savings. Run holiday sales or seasonal clearance across all categories.",
    color: "#8B5CF6",
    bgColor: "bg-purple-500/5",
  },
  {
    id: "5",
    name: "Time-Based Discount (Happy Hour Discount)",
    value: "time_based_discount",
    icon: "schedule" as const,
    description:
      "Limited time flash sales. Create urgency with time-sensitive promotional windows.",
    color: "#F59E0B",
    bgColor: "bg-yellow-500/5",
  },
];

export default function CampaignsView({
  campaigns,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: CampaignsViewProps) {
  const selectedCategoryDetail = useMemo(() => {
    return CAMPAIGN_CATEGORIES.find((c) => c.value === selectedCategory);
  }, [selectedCategory]);

  // 1. RENDER CATEGORY LIST SELECTION (Initial State)
  if (selectedCategory === null) {
    return (
      <View className="gap-y-4">
        {CAMPAIGN_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              setSelectedCategory(category.value);
              setSearchQuery("");
            }}
            activeOpacity={0.7}
            className="bg-base-300 border border-base-200 rounded-lg p-5 flex-row items-center justify-between"
          >
            {/* Visual Icon Container */}
            <View
              className={`w-12 h-12 rounded-lg items-center justify-center ${category.bgColor} mr-4`}
            >
              <MaterialIcons
                name={category.icon}
                size={24}
                color={category.color}
              />
            </View>

            {/* Title & Description */}
            <View className="flex-1 mr-3">
              <Text className="text-sm font-bold text-neutral">
                {category.name}
              </Text>
              <Text className="text-[11px] text-accent font-semibold leading-4 mt-1">
                {category.description}
              </Text>
            </View>

            {/* Chevron Link */}
            <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // 2. RENDER OFFERS LIST FOR SELECTED CATEGORY
  return (
    <FlatList
      data={campaigns}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingBottom: 80 }}
      scrollEnabled={false}
      ListHeaderComponent={
        <View className="mb-4">
          {/* Back button and title */}
          <View className="flex-row items-center gap-2 mb-4">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className="bg-base-200 p-2 rounded-lg"
            >
              <MaterialIcons name="arrow-back" size={16} color="#DC2D2A" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-accent uppercase tracking-wider">
                Campaign Category
              </Text>
              <Text
                className="text-sm font-bold text-neutral"
                numberOfLines={1}
              >
                {selectedCategoryDetail?.name}
              </Text>
            </View>
          </View>

          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search campaigns in this category..."
            containerClassName="mb-3 rounded-lg"
          />

          {/* Active Filter Indicators */}
          {searchQuery.trim() !== "" && (
            <View className="flex-row items-center justify-between mt-3 mb-1 px-1">
              <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">
                Matching {campaigns.length} Offers
              </Text>
            </View>
          )}
        </View>
      }
      renderItem={({ item }) => <CampaignCard campaign={item} />}
      ListEmptyComponent={
        isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#DC2D2A" />
            <Text className="mt-3 text-xs font-semibold text-accent">
              Loading campaign offers...
            </Text>
          </View>
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
    />
  );
}
