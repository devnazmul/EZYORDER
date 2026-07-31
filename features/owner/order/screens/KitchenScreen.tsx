import EmptyState from "@/components/reuseable/EmptyState";
import PageTitle from "@/components/reuseable/PageTitle";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import SearchBar from "@/components/reuseable/SearchBar";
import COLORS from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KitchenCard from "../components/KitchenCard";
import KitchenCardSkeleton from "../components/skeletons/KitchenCardSkeleton";
import { usePendingOrdersQuery } from "../hooks/queries/useOrderQueries";

export default function KitchenScreen() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Retrieve restaurant ID matching other screen structures
  const restaurantId = useMemo(() => {
    return user?.restaurant?.length > 0 ? String(user?.restaurant[0]?.id) : String(user?.business_id || "1");
  }, [user]);

  // Debounce order ID search input
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset to first page when search filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // Fetch pending kitchen orders
  const { data, isLoading, isRefetching, refetch } = usePendingOrdersQuery(
    token || "",
    restaurantId,
    perPage,
    page,
    debouncedSearchQuery.trim() || undefined,
  );

  const orders = data?.data || [];
  const totalCount = data?.total || 0;
  const lastPage = data?.last_page || 1;

  const showListLoader = isLoading || isRefetching;

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <View style={{ paddingHorizontal: WP("4%"), paddingTop: HP("2.5%") }} className="flex-1">
        {/* Title & Count Row */}
        <PageTitle
          title="Kitchen Orders"
          icon="restaurant-menu"
          badgeCount={totalCount}
          description="View all orders in kitchen"
        />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by Order ID..."
          containerClassName="mb-4"
        />

        {showListLoader ? (
          <View key="list-loading" className="flex-1">
            <KitchenCardSkeleton />
            <KitchenCardSkeleton />
            <KitchenCardSkeleton />
          </View>
        ) : orders.length === 0 ? (
          <View key="empty" className="flex-1 justify-center items-center py-10 bg-base-100">
            <EmptyState
              icon="assignment-late"
              title="No Pending Orders"
              description="There are currently no pending kitchen orders to display."
              pyClassName="py-10"
            />
          </View>
        ) : (
          <RefreshableScrollView
            key="loaded"
            onRefresh={async () => {
              await refetch();
            }}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: HP("5%") }}
          >
            {orders.map((order: any) => (
              <KitchenCard key={order.id} order={order} />
            ))}

            {/* Pagination Controls */}
            {lastPage > 1 ? (
              <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-base-200/50">
                <TouchableOpacity
                  disabled={page <= 1}
                  onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                  style={{ paddingHorizontal: WP("4%"), paddingVertical: HP("1.2%") }}
                  className={`flex-row items-center gap-1 rounded-xl bg-base-300 border border-base-200 ${
                    page <= 1 ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <MaterialIcons name="chevron-left" size={WP("4.5%")} color={COLORS.primary} />
                  <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                    Previous
                  </Text>
                </TouchableOpacity>

                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-accent">
                  Page {page} of {lastPage}
                </Text>

                <TouchableOpacity
                  disabled={page >= lastPage}
                  onPress={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                  style={{ paddingHorizontal: WP("4%"), paddingVertical: HP("1.2%") }}
                  className={`flex-row items-center gap-1 rounded-xl bg-base-300 border border-base-200 ${
                    page >= lastPage ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                    Next
                  </Text>
                  <MaterialIcons name="chevron-right" size={WP("4.5%")} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ) : null}
          </RefreshableScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
