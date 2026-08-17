import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getDailyOrderPartnerSales,
  getRestaurantPartners,
} from "@/features/owner/more/apis/partners";
import { useQuery } from "@tanstack/react-query";

export const useRestaurantPartnersQuery = (
  token: string,
  restaurantId: number | string,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARTNERS, restaurantId],
    queryFn: () => getRestaurantPartners(token, restaurantId),
    enabled: !!token && !!restaurantId,
  });
};

export const useDailyOrderPartnerSalesQuery = (
  token: string,
  restaurantId: number | string,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DAILY_ORDER_PARTNER_SALES, restaurantId],
    queryFn: () => getDailyOrderPartnerSales(token, restaurantId),
    enabled: !!token && !!restaurantId,
  });
};
