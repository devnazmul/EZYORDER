import EmptyState from "@/components/reuseable/EmptyState";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { useDailyOrderPartnerSalesQuery } from "@/features/owner/more/hooks/queries/usePartnerQueries";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PartnerSaleCard from "./PartnerSaleCard";

export default function PartnersSaleView() {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const {
    data: salesData,
    isLoading,
    refetch,
  } = useDailyOrderPartnerSalesQuery(restaurantId || "");

  const sales = useMemo(() => {
    if (!salesData) return [];
    if (Array.isArray(salesData)) return salesData;
    return [];
  }, [salesData]);

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <View key="loading" className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="mt-3 text-xs font-semibold text-accent">
          Loading partner sales...
        </Text>
      </View>
    );
  }

  if (sales.length === 0) {
    return (
      <EmptyState
        key="empty"
        icon="trending-up"
        title="No Sales Records Found"
        description="There are no daily partner sale records configured for this restaurant."
      />
    );
  }

  return (
    <RefreshableScrollView
      key="loaded"
      onRefresh={handleRefresh}
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <View className="mb-4">
        <Text className="text-[10px] font-bold text-accent tracking-wide px-1">
          Total {sales?.length || 0} daily partner sales found
        </Text>
      </View>

      <FlatList
        data={sales}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => <PartnerSaleCard item={item} />}
      />
    </RefreshableScrollView>
  );
}
