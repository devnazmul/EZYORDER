import CouponCard from "@/components/discounts/CouponCard";
import EmptyState from "@/components/reuseable/EmptyState";
import SearchBar from "@/components/reuseable/SearchBar";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

interface CouponsViewProps {
  coupons: any[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CouponsView({ coupons, isLoading, searchQuery, setSearchQuery }: CouponsViewProps) {
  return (
    <FlatList
      data={coupons}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingBottom: 80 }}
      scrollEnabled={false}
      ListHeaderComponent={
        <View className="mb-4">
          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search coupons name or code..."
            containerClassName="mb-3"
          />

          {/* Active Filter Indicators */}
          {searchQuery.trim() !== "" && (
            <View className="flex-row items-center justify-between mt-2 mb-1 px-1">
              <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">
                Matching {coupons.length} Coupons
              </Text>
            </View>
          )}
        </View>
      }
      renderItem={({ item }) => <CouponCard coupon={item} />}
      ListEmptyComponent={
        isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#DC2D2A" />
            <Text className="mt-3 text-xs font-semibold text-accent">Loading coupons...</Text>
          </View>
        ) : (
          <EmptyState
            icon="card-membership"
            title="No Coupons Found"
            description={
              searchQuery
                ? "No coupons match your search criteria."
                : "There are no active coupons configured."
            }
          />
        )
      }
    />
  );
}
