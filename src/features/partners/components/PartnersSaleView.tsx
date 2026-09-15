// 1. React / React Native
import { useState } from "react";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components & context
import { useAuth } from "@/context/AuthContext";

// 5. Feature components / hooks
import { useDailyOrderPartnerSalesQuery } from "../hooks/queries/usePartnerQueries";
import PartnerListLayout from "./PartnerListLayout";
import PartnerSaleCard from "./PartnerSaleCard";
import PartnerSaleDetailsBottomSheet from "./PartnerSaleDetailsBottomSheet";

// 6. Types
import type { IDailyOrderPartnerSale } from "../types/partners.types";

// 7. Constants/utils
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

  return (
    <>
      <PartnerListLayout
        data={salesData}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        isError={isError}
        error={error}
        onRefresh={handleRefresh}
        onRetry={refetch}
        emptyTitle="No Sales Records Found"
        emptyDescription="There are no daily partner sale records configured for this restaurant."
        emptyIcon="trending-up"
        errorTitle="Failed to Load Partner Sales"
        errorMessage="Failed to load partner sales."
        renderItem={(item) => (
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
