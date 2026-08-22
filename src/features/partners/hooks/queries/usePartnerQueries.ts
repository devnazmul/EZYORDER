import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getDailyOrderPartnerSales,
  getRestaurantPartners,
} from "@/features/partners/apis/partners";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";

export const useRestaurantPartnersQuery = (restaurantId: number | string) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.PARTNERS, restaurantId],
    queryFn: () => getRestaurantPartners(token!, restaurantId),
    enabled: !!token && !!restaurantId,
  });
};

export const useDailyOrderPartnerSalesQuery = (
  restaurantId: number | string,
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.DAILY_ORDER_PARTNER_SALES, restaurantId],
    queryFn: () => getDailyOrderPartnerSales(token!, restaurantId),
    enabled: !!token && !!restaurantId,
  });
};
