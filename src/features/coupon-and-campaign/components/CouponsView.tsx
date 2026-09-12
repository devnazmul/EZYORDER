// 1. React / React Native
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

// 2. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 3. Shared components / context / hooks
import { EmptyState, SearchBar } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { COUPON_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks";
import { getCurrencySymbol } from "@/utils";

// 4. Feature components / hooks
import { useCouponsQuery } from "../hooks/queries/useDiscountQueries";
import CouponCard from "./CouponCard";
import CouponCardSkeleton from "./skeletons/CouponCardSkeleton";

export default function CouponsView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;
  const currencySymbol = getCurrencySymbol(user?.restaurant?.[0]?.currency);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: couponsResponse,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCouponsQuery(restaurantId || "", 20, {
    search_key: debouncedSearchQuery.trim() || undefined,
  });

  const coupons =
    couponsResponse?.pages?.flatMap((page) => page?.data ?? []) ?? [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: COUPON_KEYS.lists() });
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
        <CouponCardSkeleton count={2} />
      </View>
    );
  };

  return (
    <FlatList
      data={isLoading && !isRefetching ? [] : coupons}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-y-3"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by coupon name or code..."
        />
      }
      renderItem={({ item }) => (
        <CouponCard coupon={item} currencySymbol={currencySymbol} />
      )}
      ListEmptyComponent={
        isLoading && !isRefetching ? (
          <CouponCardSkeleton count={3} />
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
