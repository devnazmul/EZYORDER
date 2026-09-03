import {
  DealCard,
  DishCard,
  DishDetailDrawer,
  MenuTimingSlots,
} from "../components";

import {
  Bone,
  EmptyState,
  PageTitle,
  RefreshableScrollView,
  SkeletonContainer,
  StatusBadge,
  ToggleBar,
} from "@/components/reuseable";

import { useAuth } from "@/src/context/AuthContext";
import {
  useDishesQuery,
  useSingleMenuQuery,
} from "@/features/menu/hooks/queries/useMenuQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DealCardSkeleton, DishCardSkeleton } from "../components/skeletons";

export default function DishesScreen() {
  const { user } = useAuth();
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
  } = useSingleMenuQuery(String(menuId || ""), String(restaurantId || ""));

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
  } = useDishesQuery(String(menuId || ""), queryParams);

  const rawDishesList = useMemo(() => {
    return Array.isArray(dishesPayload?.data)
      ? dishesPayload.data
      : Array.isArray(dishesPayload)
        ? dishesPayload
        : [];
  }, [dishesPayload]);

  // Split list into dishes (deal length == 0) and deals (deal length > 0)
  const dishes = useMemo(() => {
    return rawDishesList.filter(
      (item: any) => !item.deal || item.deal.length === 0,
    );
  }, [rawDishesList]);

  const deals = useMemo(() => {
    return rawDishesList.filter(
      (item: any) => item.deal && item.deal.length > 0,
    );
  }, [rawDishesList]);

  const handleRefresh = async () => {
    await Promise.all([refetchMenu(), refetchDishes()]);
  };

  const handleOpenDetails = (item: any) => {
    setSelectedDish(item);
    setDrawerVisible(true);
  };

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterValues.search_key) count++;
    if (filterValues.start_date || filterValues.end_date) count++;
    return count;
  }, [filterValues]);

  const listData = activeTab === "dishes" ? dishes : deals;
  const menuIsTimeBased =
    menuDetails?.is_time_based === 1 || menuDetails?.is_time_based === "1";

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <RefreshableScrollView
        className="flex-1 flex-col px-4 py-4"
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PageTitle
          title={String("All dishes of " + menuName || "Category Menu")}
          icon="restaurant-menu"
          description={`Total ${listData.length} ${activeTab} found`}
        />

        <CategoryHeaderSection
          isMenuLoading={isMenuLoading}
          menuDetails={menuDetails}
          menuName={menuName}
          listDataLength={listData.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dishesCount={dishes.length}
          dealsCount={deals.length}
          menuIsTimeBased={menuIsTimeBased}
        />

        <MenuContentSection
          isLoading={isMenuLoading || isDishesLoading || isRefetching}
          activeTab={activeTab}
          listData={listData}
          activeFilterCount={activeFilterCount}
          searchBarValue={searchBarValue}
          handleOpenDetails={handleOpenDetails}
        />
      </RefreshableScrollView>

      {/* Slide up details drawer */}
      <DishDetailDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        dish={selectedDish}
      />
    </SafeAreaView>
  );
}

interface CategoryHeaderSectionProps {
  isMenuLoading: boolean;
  menuDetails: any;
  menuName: string | string[];
  listDataLength: number;
  activeTab: "dishes" | "deals";
  setActiveTab: (tab: "dishes" | "deals") => void;
  dishesCount: number;
  dealsCount: number;
  menuIsTimeBased: boolean;
}

function CategoryHeaderSection({
  isMenuLoading,
  menuDetails,
  menuName,
  listDataLength,
  activeTab,
  setActiveTab,
  dishesCount,
  dealsCount,
  menuIsTimeBased,
}: Readonly<CategoryHeaderSectionProps>) {
  if (isMenuLoading) {
    return (
      <View style={{ marginBottom: WP("4%") }} className="gap-y-4">
        {/* Category Details Banner Skeleton */}
        <SkeletonContainer
          style={{ padding: WP("4%"), gap: WP("2%") }}
          className="bg-base-300 border border-base-200 rounded-xl shadow-sm"
        >
          <View className="flex-row justify-between items-center">
            <Bone width={WP("25%")} height={12} borderRadius={4} />
            <Bone width={WP("15%")} height={16} borderRadius={9999} />
          </View>
          <Bone
            width={WP("40%")}
            height={18}
            borderRadius={4}
            className="mt-1"
          />
          <Bone
            width={WP("80%")}
            height={12}
            borderRadius={4}
            className="mt-1"
          />
        </SkeletonContainer>

        {/* Operating Weekly Schedule Skeleton */}
        <SkeletonContainer className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
          <View
            style={{
              paddingHorizontal: WP("4%"),
              paddingVertical: WP("3%"),
              gap: WP("2%"),
            }}
            className="bg-base-200 flex-row items-center border-b border-base-200/50"
          >
            <Bone width={16} height={16} circle />
            <Bone width={WP("45%")} height={12} borderRadius={4} />
          </View>
          <View className="p-3 gap-y-3">
            <Bone width={WP("15%")} height={12} borderRadius={4} />
            <View className="flex-row gap-2">
              <Bone width={WP("30%")} height={18} borderRadius={9999} />
              <Bone width={WP("30%")} height={18} borderRadius={9999} />
            </View>
          </View>
        </SkeletonContainer>

        {/* Tab Selection */}
        <ToggleBar
          options={[
            { id: "dishes", label: "Dishes (0)" },
            { id: "deals", label: "Deals (0)" },
          ]}
          activeId={activeTab}
          onSelect={(id) => setActiveTab(id as any)}
        />
      </View>
    );
  }

  if (!menuDetails) return null;

  return (
    <View className="gap-y-3">
      {/* Category Details Banner */}
      <View
        style={{ padding: WP("3%"), gap: 3 }}
        className="bg-base-300 border border-base-200 rounded-xl shadow-sm"
      >
        <View className="flex-row justify-between items-center">
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-accent capitalize tracking-wide"
          >
            Category Information
          </Text>
          <StatusBadge
            status={
              menuDetails?.show_in_customer === 1 ||
              menuDetails?.show_in_customer === "1"
                ? "active"
                : "inactive"
            }
          />
        </View>
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="font-bold text-neutral"
        >
          {menuDetails.name}
        </Text>
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="text-accent/80 font-medium"
        >
          {menuDetails.description || "No description provided."}
        </Text>
      </View>

      {/* Operational Time Slots if Category is Time-Based */}
      {menuIsTimeBased && (
        <MenuTimingSlots timeSlots={menuDetails?.time_slots} />
      )}

      {/* Tab Selection */}
      <ToggleBar
        options={[
          { id: "dishes", label: `Dishes (${dishesCount})` },
          { id: "deals", label: `Deals (${dealsCount})` },
        ]}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id as any)}
      />
    </View>
  );
}

interface MenuContentSectionProps {
  isLoading: boolean;
  activeTab: "dishes" | "deals";
  listData: any[];
  activeFilterCount: number;
  searchBarValue: string;
  handleOpenDetails: (item: any) => void;
}

function MenuContentSection({
  isLoading,
  activeTab,
  listData,
  activeFilterCount,
  searchBarValue,
  handleOpenDetails,
}: Readonly<MenuContentSectionProps>) {
  if (isLoading) {
    return (
      <View key="loading" className="flex-1">
        {activeTab === "dishes" ? <DishCardSkeleton /> : <DealCardSkeleton />}
      </View>
    );
  }

  if (listData.length === 0) {
    return (
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
    );
  }

  return (
    <View key="loaded" className="gap-y-3">
      {listData.map((item: any) =>
        activeTab === "dishes" ? (
          <DishCard
            key={item.id}
            dish={item}
            onPress={() => handleOpenDetails(item)}
          />
        ) : (
          <DealCard
            key={item.id}
            deal={item}
            onPress={() => handleOpenDetails(item)}
          />
        ),
      )}
    </View>
  );
}
