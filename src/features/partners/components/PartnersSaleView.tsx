// 1. React / React Native
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components & context
import { EmptyState, ErrorState } from "@/components/reuseable";
import { useAuth } from "@/context/AuthContext";

// 5. Feature components / hooks
import { useDailyOrderPartnerSalesQuery } from "../hooks/queries/usePartnerQueries";
import PartnerSaleCard from "./PartnerSaleCard";
import PartnerSaleDetailsBottomSheet from "./PartnerSaleDetailsBottomSheet";
import PartnerSaleCardSkeleton from "./skeletons/PartnerSaleCardSkeleton";

// 6. Feature types
import type { IDailyOrderPartnerSale } from "../types/partners.types";

// 7. Constants/utils
import { COLORS } from "@/constants";
import { PARTNER_KEYS } from "@/constants/queryKeys";

export default function PartnersSaleView() {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSale, setSelectedSale] =
    useState<IDailyOrderPartnerSale | null>(null);

  const {
    data: salesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDailyOrderPartnerSalesQuery({
    restaurant_id: restaurantId || "",
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: PARTNER_KEYS.saleList({ restaurant_id: restaurantId || "" }),
    });
    setIsRefreshing(false);
  };

  if (isLoading || isRefreshing) {
    return <PartnerSaleCardSkeleton count={5} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Partner Sales"
        message={
          error instanceof Error
            ? error.message
            : "Failed to load partner sales."
        }
        onRetry={refetch}
      />
    );
  }

  if (!salesData || salesData.length === 0) {
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
    <>
      <FlatList
        data={salesData}
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
          <PartnerSaleCard item={item} onPress={() => setSelectedSale(item)} />
        )}
      />

      <PartnerSaleDetailsBottomSheet
        visible={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        sale={selectedSale}
      />
    </>
  );
}
