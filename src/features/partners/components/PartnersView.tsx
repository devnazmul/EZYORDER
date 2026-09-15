// 1. React / React Native
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components & context
import { EmptyState, ErrorState } from "@/components/reuseable";
import { useAuth } from "@/context/AuthContext";

// 5. Feature components / hooks
import { useRestaurantPartnersQuery } from "../hooks/queries/usePartnerQueries";
import PartnerCard from "./PartnerCard";
import PartnerDetailsBottomSheet from "./PartnerDetailsBottomSheet";
import PartnerCardSkeleton from "./skeletons/PartnerCardSkeleton";

// 6. Types
import type { IRestaurantPartner } from "../types/partners.types";

// 7. Constants/utils
import { COLORS } from "@/constants";
import { PARTNER_KEYS } from "@/constants/queryKeys";

export default function PartnersView() {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<IRestaurantPartner | null>(null);

  const {
    data: partnersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRestaurantPartnersQuery({ restaurant_id: restaurantId || "" });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: PARTNER_KEYS.list({ restaurant_id: restaurantId || "" }),
    });
    setIsRefreshing(false);
  };

  if (isLoading || isRefreshing) {
    return <PartnerCardSkeleton count={5} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Partners"
        message={
          error instanceof Error
            ? error.message
            : "Failed to load restaurant partners."
        }
        onRetry={refetch}
      />
    );
  }

  if (!partnersData || partnersData.length === 0) {
    return (
      <EmptyState
        icon="handshake"
        title="No Partners Configured"
        description="There are no partners configured for this restaurant."
      />
    );
  }

  return (
    <>
      <FlatList
        data={partnersData}
        keyExtractor={(item) => String(item.id)}
        className="flex-1"
        contentContainerStyle={{ gap: 16, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        renderItem={({ item }) => (
          <PartnerCard item={item} onPress={() => setSelectedPartner(item)} />
        )}
      />

      <PartnerDetailsBottomSheet
        visible={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        partner={selectedPartner}
      />
    </>
  );
}
