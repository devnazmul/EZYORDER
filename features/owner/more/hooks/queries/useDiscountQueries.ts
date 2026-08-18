import { QUERY_KEYS } from "@/constants/queryKeys";
import { getCampaigns, getCoupons } from "@/features/owner/more/apis/discounts";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useCouponsQuery = (
  businessId: number | string,
  perPage: number = 50,
  params: Record<string, any> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.COUPONS, businessId, perPage, params],
    queryFn: () => getCoupons(token!, businessId, perPage, params),
    enabled: !!token && !!businessId,
  });
};

export const useCampaignsQuery = (
  restaurantId: number | string,
  perPage: number = 50,
  params: Record<string, any> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, restaurantId, perPage, params],
    queryFn: () => getCampaigns(token!, restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};
