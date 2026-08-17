import { useQuery } from "@tanstack/react-query";
import { getCoupons, getCampaigns } from "@/features/owner/more/apis/discounts";
import { QUERY_KEYS } from "@/config/queryKeys";

export const useCouponsQuery = (
  token: string,
  businessId: number | string,
  perPage: number = 50,
  params: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COUPONS, businessId, perPage, params],
    queryFn: () => getCoupons(token, businessId, perPage, params),
    enabled: !!token && !!businessId,
  });
};

export const useCampaignsQuery = (
  token: string,
  restaurantId: number | string,
  perPage: number = 50,
  params: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, restaurantId, perPage, params],
    queryFn: () => getCampaigns(token, restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};
