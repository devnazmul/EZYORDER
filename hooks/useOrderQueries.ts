import { getAllOrders, getPendingOrders, getTodayOrders } from "@/apis/orders";
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

export const usePendingOrdersQuery = (
  token: string,
  restaurantId: string | number,
  perPage: number = 12,
  page: number = 1,
  orderId?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "pending", restaurantId, perPage, page, orderId],
    queryFn: () => getPendingOrders(token, restaurantId, perPage, page, orderId),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};
