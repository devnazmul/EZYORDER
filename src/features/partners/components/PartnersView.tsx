// 1. React / React Native
import { useState } from "react";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components & context
import { useAuth } from "@/context/AuthContext";

// 5. Feature components / hooks
import { useRestaurantPartnersQuery } from "../hooks/queries/usePartnerQueries";
import PartnerCard from "./PartnerCard";
import PartnerDetailsBottomSheet from "./PartnerDetailsBottomSheet";
import PartnerListLayout from "./PartnerListLayout";

// 6. Types
import type { IRestaurantPartner } from "../types/partners.types";

// 7. Constants/utils
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

  return (
    <>
      <PartnerListLayout
        data={partnersData}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        isError={isError}
        error={error}
        onRefresh={handleRefresh}
        onRetry={refetch}
        emptyTitle="No Partners Configured"
        emptyDescription="There are no partners configured for this restaurant."
        emptyIcon="handshake"
        errorTitle="Failed to Load Partners"
        errorMessage="Failed to load restaurant partners."
        renderItem={(item) => (
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
