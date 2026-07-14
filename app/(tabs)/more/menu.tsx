import CategoryCard from "@/components/menu/CategoryCard";
import KpiCard from "@/components/reports/KpiCard";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import SearchBar from "@/components/reuseable/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useMenuAllQuery, useMenuMatrixQuery } from "@/hooks/useMenuQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuManagement() {
  const { user, token } = useAuth();
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
    refetch: refetchMenus,
  } = useMenuAllQuery(token || "", String(restaurantId || ""), menuParams);

  // Fetch KPI matrix counts
  const {
    data: matrixData,
    isLoading: isMatrixLoading,
    refetch: refetchMatrix,
  } = useMenuMatrixQuery(token || "");

  const menuList = useMemo(() => {
    return Array.isArray(menuData) ? menuData : [];
  }, [menuData]);

  // Offloaded to API querying
  const filteredMenuList = menuList;

  const handleRefresh = async () => {
    await Promise.all([refetchMenus(), refetchMatrix()]);
  };

  const isLoading = isMenuLoading || isMatrixLoading;

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <RefreshableScrollView
        className="flex-1 px-4 py-4"
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Header Title Area inside ScrollView */}
        <View className="flex-row items-center gap-2 mb-4">
          <View className="bg-primary-container/10 p-1.5 rounded-lg">
            <MaterialIcons name="restaurant" size={18} color="#DC2D2A" />
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-black text-neutral uppercase tracking-tight">ALL MENU</Text>
            {filteredMenuList.length > 0 && (
              <View className="bg-primary px-2.5 py-0.5 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-black">{filteredMenuList.length}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats KPIs Summary*/}
        <View className="mb-6">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-3">
            Menu Stats
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Total Menu"
                value={String(matrixData?.total_menu ?? 0)}
                iconName="restaurant-menu"
                variant="dark"
                gradientColors={["#2d3e56", "#1b283c"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Total Dishes"
                value={String(matrixData?.total_dishes ?? 0)}
                iconName="restaurant"
                variant="dark"
                gradientColors={["#1e4f43", "#11322b"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Dish Options"
                value={String(matrixData?.total_dish_option ?? 0)}
                iconName="trending-up"
                variant="dark"
                gradientColors={["#4c3590", "#2e1e5c"]}
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <KpiCard
                title="Total Deals"
                value={String(matrixData?.total_deal ?? 0)}
                iconName="local-offer"
                variant="dark"
                gradientColors={["#6d242b", "#3d1115"]}
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
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-3">
            Menu Categories
          </Text>

          {isLoading && filteredMenuList.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2D2A" />
              <Text className="text-xs text-accent mt-3">Loading menu inventory...</Text>
            </View>
          ) : filteredMenuList.length === 0 ? (
            <View className="bg-base-300 border border-base-200 rounded-xl p-8 items-center justify-center">
              <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-3">
                <MaterialIcons name="restaurant-menu" size={32} color="#DC2D2A" />
              </View>
              <Text className="text-md font-bold text-neutral">No Menus Found</Text>
              <Text className="text-xs text-accent text-center mt-1">
                {searchQuery
                  ? "Try searching for a different item name"
                  : "Your restaurant menu is currently empty"}
              </Text>
            </View>
          ) : (
            <View className="gap-y-4">
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
