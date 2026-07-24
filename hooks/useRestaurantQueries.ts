import { getAllCombineData, getBusinessTiming, getRestaurant } from "@/apis/restaurant";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCombineDataQuery = (token: string, businessId: number | string | null, userType?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMBINE_DATA, businessId],
    queryFn: () => getAllCombineData(token),
    enabled: !!token && !!businessId && ["restaurant_Owner", "admin", "owner"].includes(userType || ""),
  });
};

export const useRestaurantQuery = (token: string, targetId: number | string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESTAURANT, targetId],
    queryFn: () => getRestaurant(token, targetId!),
    enabled: !!token && !!targetId,
  });
};

export const useBusinessTimingQuery = (token: string, targetId: number | string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_TIMING, targetId],
    queryFn: () => getBusinessTiming(token, targetId!),
    enabled: !!token && !!targetId,
  });
};
