import AppHeader from "@/components/AppHeader";
import KitchenCard from "@/components/orders/KitchenCard";
import EmptyState from "@/components/reuseable/EmptyState";
import LoadingScreen from "@/components/reuseable/LoadingScreen";
import PageTitle from "@/components/reuseable/PageTitle";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import SearchBar from "@/components/reuseable/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { usePendingOrdersQuery } from "@/hooks/useOrderQueries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KitchenScreen() {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Retrieve restaurant ID matching other screen structures
  const restaurantId = useMemo(() => {
    return user?.restaurant?.length > 0
      ? String(user?.restaurant[0]?.id)
      : String(user?.business_id || "1");
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
    debouncedSearchQuery.trim() || undefined
  );

  const orders = data?.data || [];
  const totalCount = data?.total || 0;
  const lastPage = data?.last_page || 1;

  if (isLoading) {
    return (
      <View key="loading" className="flex-1">
        <LoadingScreen message="Loading kitchen orders..." />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

      <View className="flex-1 px-4 py-4">
        {/* Title & Count Row */}
        <PageTitle title="Kitchen Orders" icon="restaurant-menu" badgeCount={totalCount} />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by Order ID..."
          containerClassName="mb-4"
        />

        {orders.length === 0 ? (
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
            contentContainerStyle={{ paddingBottom: 40 }}
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
                  className={`flex-row items-center gap-1 px-4 py-2 rounded-xl bg-base-300 border border-base-200 ${
                    page <= 1 ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <MaterialIcons name="chevron-left" size={16} color="#DC2D2A" />
                  <Text className="text-xs font-bold text-neutral">Previous</Text>
                </TouchableOpacity>

                <Text className="text-xs font-bold text-accent">
                  Page {page} of {lastPage}
                </Text>

                <TouchableOpacity
                  disabled={page >= lastPage}
                  onPress={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                  className={`flex-row items-center gap-1 px-4 py-2 rounded-xl bg-base-300 border border-base-200 ${
                    page >= lastPage ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Text className="text-xs font-bold text-neutral">Next</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#DC2D2A" />
                </TouchableOpacity>
              </View>
            ) : null}
          </RefreshableScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
