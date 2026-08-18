import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getAllCombineData,
  getBusinessTiming,
  getRestaurant,
} from "@/features/owner/more/apis/restaurant";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useCombineDataQuery = (
  businessId: number | string | null,
  userType?: string,
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.COMBINE_DATA, businessId],
    queryFn: () => getAllCombineData(token!),
    enabled:
      !!token &&
      !!businessId &&
      ["restaurant_Owner", "admin", "owner"].includes(userType || ""),
  });
};

export const useRestaurantQuery = (targetId: number | string | null) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.RESTAURANT, targetId],
    queryFn: () => getRestaurant(token!, targetId!),
    enabled: !!token && !!targetId,
  });
};

export const useBusinessTimingQuery = (targetId: number | string | null) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_TIMING, targetId],
    queryFn: () => getBusinessTiming(token!, targetId!),
    enabled: !!token && !!targetId,
  });
};
