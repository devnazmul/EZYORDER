import { getAllOrders, getTodayOrders } from "@/apis/orders";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useTodayOrdersQuery = (
  token: string,
  restaurantId: string | number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "today", restaurantId],
    queryFn: () => getTodayOrders(token, restaurantId),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};

export const useAllOrdersQuery = (
  token: string,
  restaurantId: string | number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "all", restaurantId],
    queryFn: () => getAllOrders(token, restaurantId),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};
