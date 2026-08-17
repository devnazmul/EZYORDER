import EmptyState from "@/components/reuseable/EmptyState";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { useRestaurantPartnersQuery } from "@/features/owner/more/hooks/queries/usePartnerQueries";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PartnerCard from "./PartnerCard";

export default function PartnersView() {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const {
    data: partnersData,
    isLoading,
    refetch,
  } = useRestaurantPartnersQuery(token || "", restaurantId || "");

  const partners = useMemo(() => {
    if (!partnersData) return [];
    if (Array.isArray(partnersData)) return partnersData;
    return [];
  }, [partnersData]);

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <View key="loading" className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="mt-3 text-xs font-semibold text-accent">
          Loading partners...
        </Text>
      </View>
    );
  }

  if (partners.length === 0) {
    return (
      <EmptyState
        key="empty"
        icon="handshake"
        title="No Partners Configured"
        description="There are no partners configured for this restaurant."
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
          Total {partners?.length || 0} Restaurant partners found
        </Text>
      </View>

      <FlatList
        data={partners}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => <PartnerCard item={item} />}
      />
    </RefreshableScrollView>
  );
}
