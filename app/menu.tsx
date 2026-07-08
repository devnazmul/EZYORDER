import AppHeader from "@/components/AppHeader";
import KpiCard from "@/components/reports/KpiCard";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import SearchBar from "@/components/reuseable/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useMenuAllQuery, useMenuMatrixQuery } from "@/hooks/useMenuQueries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuManagement() {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id || user?.business_id;

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all menu items
  const {
    data: menuData,
    isLoading: isMenuLoading,
    refetch: refetchMenus,
  } = useMenuAllQuery(token || "", String(restaurantId || ""));

  // Fetch KPI matrix counts
  const {
    data: matrixData,
    isLoading: isMatrixLoading,
    refetch: refetchMatrix,
  } = useMenuMatrixQuery(token || "");

  const menuList = useMemo(() => {
    console.log(menuData);
    return Array.isArray(menuData) ? menuData : [];
  }, [menuData]);

  // Handle local searching of categories
  const filteredMenuList = useMemo(() => {
    if (!searchQuery.trim()) return menuList;
    const query = searchQuery.toLowerCase();
    return menuList.filter(
      (item) => item?.name?.toLowerCase().includes(query) || item?.description?.toLowerCase().includes(query),
    );
  }, [menuList, searchQuery]);

  const handleRefresh = async () => {
    await Promise.all([refetchMenus(), refetchMatrix()]);
  };

  const isLoading = isMenuLoading || isMatrixLoading;

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

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

        {/* Search Field */}

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search categories here..."
          containerClassName="mb-6"
        />
        {/* Stats KPIs Summary*/}
        <View className="mb-6">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-3">
            Menu Stats
          </Text>
          <View className="gap-3">
            <KpiCard
              title="Total Menu"
              value={String(matrixData?.total_menu ?? 0)}
              iconName="restaurant-menu"
              variant="dark"
              gradientColors={["#162032", "#0a1220"]}
            />
            <KpiCard
              title="Total Dishes"
              value={String(matrixData?.total_dishes ?? 0)}
              iconName="restaurant"
              variant="dark"
              gradientColors={["#0d2b24", "#061510"]}
            />
            <KpiCard
              title="Total Dish Options"
              value={String(matrixData?.total_dish_option ?? 0)}
              iconName="trending-up"
              variant="dark"
              gradientColors={["#2b1a5e", "#1a0d3a"]}
            />
            <KpiCard
              title="Total Deals"
              value={String(matrixData?.total_deal ?? 0)}
              iconName="local-offer"
              variant="dark"
              gradientColors={["#3a0d12", "#1a0608"]}
            />
          </View>
        </View>

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
              {filteredMenuList.map((item) => {
                const isActive = item?.show_in_customer === 1 || item?.show_in_customer === "1";
                const isTimeBased = item?.is_time_based === 1 || item?.is_time_based === "1";
                const dishCount = Array.isArray(item?.dishes) ? item.dishes.length : 0;
                return (
                  <View
                    key={item?.id || String(item?.name)}
                    className={`bg-base-300 border rounded-lg p-4 shadow-sm ${
                      !isActive ? "border-l-4 border-l-primary border-base-200" : "border-base-200"
                    }`}
                  >
                    {/* Top Row: Name, time-based badge & View icon */}
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-row items-center flex-1 pr-2 gap-2">
                        <Text className="text-md font-black text-neutral shrink" numberOfLines={1}>
                          {item?.name}
                        </Text>
                        {isTimeBased && (
                          <View className="flex-row items-center bg-amber-100 px-2 py-0.5 rounded-full gap-1">
                            <MaterialIcons name="schedule" size={10} color="#92400e" />
                            <Text className="text-[9px] font-bold text-amber-800 ml-0.5">Time-Based</Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert("Menu detail", `Opening dishes list for: ${item?.name}`);
                        }}
                        className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center"
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="visibility" size={18} color="#2563EB" />
                      </TouchableOpacity>
                    </View>

                    {/* Details Row: Description, Status, Dishes count */}
                    <View className="flex-row border-t border-base-200/50 border-dashed pt-3 justify-between">
                      {/* Description */}
                      <View className="flex-1 pr-2">
                        <Text className="text-[9px] font-bold text-accent uppercase tracking-wider">
                          Description
                        </Text>
                        <Text className="text-xs text-accent/80 font-medium mt-0.5" numberOfLines={1}>
                          {item?.description || "No description"}
                        </Text>
                      </View>

                      {/* Status */}
                      <View className="items-center px-2">
                        <Text className="text-[9px] font-bold text-accent uppercase tracking-wider mb-0.5">
                          Status
                        </Text>
                        <View
                          className={`px-2.5 py-0.5 rounded-lg ${isActive ? "bg-green-100" : "bg-red-100"}`}
                        >
                          <Text
                            className={`text-[9px] font-bold uppercase ${
                              isActive ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </Text>
                        </View>
                      </View>

                      {/* Dishes count */}
                      <View className="items-end pl-2">
                        <Text className="text-[9px] font-bold text-accent uppercase tracking-wider">
                          Dishes
                        </Text>
                        <Text className="text-md font-black text-neutral mt-0.5">{dishCount}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
