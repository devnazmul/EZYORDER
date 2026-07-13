import AppHeader from "@/components/AppHeader";
import DealCard from "@/components/menu/DealCard";
import DishCard from "@/components/menu/DishCard";
import DishDetailDrawer from "@/components/menu/DishDetailDrawer";
import MenuTimingSlots from "@/components/menu/MenuTimingSlots";
import EmptyState from "@/components/reuseable/EmptyState";
import { FilterField } from "@/components/reuseable/FilterDrawer";
import PageTitle from "@/components/reuseable/PageTitle";
import StatusBadge from "@/components/reuseable/StatusBadge";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useDishesQuery, useSingleMenuQuery } from "@/hooks/useMenuQueries";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTER_FIELDS: FilterField[] = [
  { id: "search_key", label: "Search Keyword", type: "text" },
  { id: "date_range", label: "Date Range", type: "date-range" },
];

export default function DishesScreen() {
  const { token, user } = useAuth();
  const { menuId, menuName } = useLocalSearchParams();
  const restaurantId = user?.restaurant?.[0]?.id || user?.business_id;

  const [activeTab, setActiveTab] = useState<"dishes" | "deals">("dishes");
  const [searchBarValue, setSearchBarValue] = useState("");

  // API parameter state
  const [filterValues, setFilterValues] = useState({
    search_key: "",
    start_date: "",
    end_date: "",
  });

  // Modal Detail State
  const [selectedDish, setSelectedDish] = useState<any | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 1. Fetch single menu settings details (for time-based operational hour slots)
  const {
    data: menuDetails,
    isLoading: isMenuLoading,
    refetch: refetchMenu,
  } = useSingleMenuQuery(token || "", String(menuId || ""), String(restaurantId || ""));

  const debouncedSearchKey = useDebounce(searchBarValue, 500);

  // API parameters object sent to query
  const queryParams = useMemo(() => {
    return {
      business_id: restaurantId,
      restaurant_id: restaurantId,
      perPage: 10000000,
      start_date: filterValues.start_date,
      end_date: filterValues.end_date,
      search_key: filterValues.search_key || debouncedSearchKey,
      menu_id: menuId,
    };
  }, [restaurantId, menuId, filterValues, debouncedSearchKey]);

  // 2. Fetch dishes list using dynamic API filters
  const {
    data: dishesPayload,
    isLoading: isDishesLoading,
    isRefetching,
    refetch: refetchDishes,
  } = useDishesQuery(token || "", String(menuId || ""), queryParams);

  const rawDishesList = useMemo(() => {
    return Array.isArray(dishesPayload?.data)
      ? dishesPayload.data
      : Array.isArray(dishesPayload)
        ? dishesPayload
        : [];
  }, [dishesPayload]);

  // Split list into dishes (deal length == 0) and deals (deal length > 0)
  const dishes = useMemo(() => {
    return rawDishesList.filter((item: any) => !item.deal || item.deal.length === 0);
  }, [rawDishesList]);

  const deals = useMemo(() => {
    return rawDishesList.filter((item: any) => item.deal && item.deal.length > 0);
  }, [rawDishesList]);

  const handleRefresh = async () => {
    await Promise.all([refetchMenu(), refetchDishes()]);
  };

  const handleApplyFilters = (drawerValues: any) => {
    setFilterValues({
      search_key: drawerValues.search_key || "",
      start_date: drawerValues.date_range?.start || "",
      end_date: drawerValues.date_range?.end || "",
    });
  };

  const handleClearFilters = () => {
    setFilterValues({
      search_key: "",
      start_date: "",
      end_date: "",
    });
    setSearchBarValue("");
  };

  const handleOpenDetails = (item: any) => {
    setSelectedDish(item);
    setDrawerVisible(true);
  };

  // Convert state filterValues into FilterDrawer values format
  const filterDrawerValues = useMemo(() => {
    return {
      search_key: filterValues.search_key,
      date_range: {
        start: filterValues.start_date,
        end: filterValues.end_date,
      },
    };
  }, [filterValues]);

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterValues.search_key) count++;
    if (filterValues.start_date || filterValues.end_date) count++;
    return count;
  }, [filterValues]);

  const listData = activeTab === "dishes" ? dishes : deals;
  const menuIsTimeBased = menuDetails?.is_time_based === 1 || menuDetails?.is_time_based === "1";

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

      <View className="flex-1 px-4 py-4">
        <PageTitle title={String(menuName || "Category Menu")} icon="restaurant" />

        {menuDetails && (
          <View className="mb-4 gap-y-4">
            {/* Category Details Banner */}
            <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm gap-y-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-[9px] font-bold text-accent uppercase tracking-wider">
                  Category Information
                </Text>
                <StatusBadge
                  status={
                    menuDetails?.show_in_customer === 1 || menuDetails?.show_in_customer === "1"
                      ? "active"
                      : "inactive"
                  }
                />
              </View>
              <Text className="text-md font-bold text-neutral">{menuDetails.name}</Text>
              <Text className="text-xs text-accent/80 font-medium">
                {menuDetails.description || "No description provided."}
              </Text>
            </View>

            {/* Operational Time Slots if Category is Time-Based */}
            {menuIsTimeBased && <MenuTimingSlots timeSlots={menuDetails?.time_slots} />}

            {/* Tab Selection */}
            <ToggleBar
              options={[
                { id: "dishes", label: `Dishes (${dishes.length})` },
                { id: "deals", label: `Deals (${deals.length})` },
              ]}
              activeId={activeTab}
              onSelect={(id) => setActiveTab(id as any)}
            />

            {/* Search & Drawer Filter Bar commented out */}
            {/* <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <SearchBar
                  value={searchBarValue}
                  onChangeText={setSearchBarValue}
                  placeholder={`Search ${activeTab}...`}
                />
              </View>
              <FilterDrawer
                fields={FILTER_FIELDS}
                values={filterDrawerValues}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </View> */}
          </View>
        )}

        {isMenuLoading ? (
          <View key="loading" className="py-24 items-center justify-center">
            <ActivityIndicator size="large" color="#DC2D2A" />
            <Text className="text-xs text-accent mt-3">Loading category details...</Text>
          </View>
        ) : (
          <FlatList
            key="loaded"
            data={isDishesLoading ? [] : listData}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) =>
              activeTab === "dishes" ? (
                <DishCard dish={item} onPress={() => handleOpenDetails(item)} />
              ) : (
                <DealCard deal={item} onPress={() => handleOpenDetails(item)} />
              )
            }
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor="#DC2D2A"
                colors={["#DC2D2A"]}
              />
            }
            ListEmptyComponent={
              isDishesLoading ? (
                <View className="py-16 items-center justify-center">
                  <ActivityIndicator size="large" color="#DC2D2A" />
                  <Text className="text-xs text-accent mt-3">Updating list...</Text>
                </View>
              ) : (
                <View key="empty" className="mt-8">
                  <EmptyState
                    icon={activeTab === "dishes" ? "restaurant-menu" : "local-offer"}
                    title={`No ${activeTab === "dishes" ? "Dishes" : "Deals"} Found`}
                    description={
                      activeFilterCount > 0 || searchBarValue
                        ? "Try clearing filters or search queries to see all items."
                        : `Your restaurant currently has no ${activeTab} in this category.`
                    }
                    pyClassName="py-16"
                  />
                </View>
              )
            }
          />
        )}
      </View>

      {/* Slide up details drawer */}
      <DishDetailDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} dish={selectedDish} />
    </SafeAreaView>
  );
}
