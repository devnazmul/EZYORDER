import {
  EmptyState,
  KpiCard,
  PageTitle,
  RefreshableScrollView,
  SearchBar,
} from "@/components/reuseable";

import { useAuth } from "@/src/context/AuthContext";
import {
  useMenuAllQuery,
  useMenuMatrixQuery,
} from "@/features/menu/hooks/queries/useMenuQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { getResponsiveFontSize } from "@/utils/getResponsiveSizes";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryCard } from "../components";
import { CategoryCardSkeleton } from "../components/skeletons";

export default function MenuManagement() {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id || user?.business_id;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const menuParams = useMemo(() => {
    return { search_key: debouncedSearchQuery };
  }, [debouncedSearchQuery]);

  // Fetch all menu items
  const {
    data: menuData,
    isLoading: isMenuLoading,
    isFetching: isMenuFetching,
    refetch: refetchMenus,
  } = useMenuAllQuery(String(restaurantId || ""), menuParams);

  // Fetch KPI matrix counts
  const {
    data: matrixData,
    isLoading: isMatrixLoading,
    refetch: refetchMatrix,
  } = useMenuMatrixQuery();

  const menuList = useMemo(() => {
    return Array.isArray(menuData) ? menuData : [];
  }, [menuData]);

  // Offloaded to API querying
  const filteredMenuList = menuList;

  const handleRefresh = async () => {
    await Promise.all([refetchMenus(), refetchMatrix()]);
  };

  const showSkeleton = isMenuLoading || isMenuFetching;

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <RefreshableScrollView
        className="flex-1 flex-col px-4 py-4"
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PageTitle
          icon="restaurant-menu"
          title="All Menu"
          description="All Menu and Dishes detail"
          badgeCount={filteredMenuList?.length || 0}
        />

        {/* Stats KPIs Summary - 2x2 Grid */}
        <View className="flex-1 mb-6 gap-y-3">
          {/* Row 1 */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <KpiCard
                title="Total Menu"
                value={String(matrixData?.total_menu ?? 0)}
                icon="restaurant-menu"
                variant="dark"
                gradientColors={["#2d3e56", "#1b283c"]}
                loading={isMatrixLoading}
              />
            </View>
            <View className="flex-1">
              <KpiCard
                title="Total Dishes"
                value={String(matrixData?.total_dishes ?? 0)}
                icon="restaurant"
                variant="dark"
                gradientColors={["#1e4f43", "#11322b"]}
                loading={isMatrixLoading}
              />
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <KpiCard
                title="Dish Options"
                value={String(matrixData?.total_dish_option ?? 0)}
                icon="trending-up"
                variant="dark"
                gradientColors={["#4c3590", "#2e1e5c"]}
                loading={isMatrixLoading}
              />
            </View>
            <View className="flex-1">
              <KpiCard
                title="Total Deals"
                value={String(matrixData?.total_deal ?? 0)}
                icon="local-offer"
                variant="dark"
                gradientColors={["#6d242b", "#3d1115"]}
                loading={isMatrixLoading}
              />
            </View>
          </View>
        </View>

        {/* Search Field */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search categories here..."
          containerClassName="mb-6"
        />

        {/* Categories Section */}
        <View className="flex-1">
          <Text
            className="font-bold text-accent capitalize tracking-widest px-1 mb-3"
            style={{ fontSize: getResponsiveFontSize("sm") }}
          >
            Menu Categories
          </Text>

          {showSkeleton ? (
            <CategoryCardSkeleton key="loading" />
          ) : filteredMenuList.length === 0 ? (
            <View
              key="empty"
              className="bg-base-300 border border-base-200 rounded-xl p-8 items-center justify-center"
            >
              <EmptyState
                icon="restaurant-menu"
                title="No Menu Category Found"
                description={
                  searchQuery
                    ? "Try searching for a different item name"
                    : "Your restaurant menu is currently empty"
                }
              />
            </View>
          ) : (
            <View key="loaded" className="gap-y-4">
              {filteredMenuList.map((item) => (
                <CategoryCard
                  key={item?.id || String(item?.name)}
                  item={item}
                  onPress={() => {
                    router.push({
                      pathname: "/more/dishes",
                      params: { menuId: item?.id, menuName: item?.name },
                    });
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
