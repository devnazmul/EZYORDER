import { QUERY_KEYS } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders, getPendingOrders, getTodayOrders } from "../../apis/orders";

export const useTodayOrdersQuery = (
  token: string,
  restaurantId: string | number,
  params: Record<string, any> = {},
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "today", restaurantId, params],
    queryFn: () => getTodayOrders(token, restaurantId, params),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};

export const useAllOrdersQuery = (
  token: string,
  restaurantId: string | number,
  params: Record<string, any> = {},
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "all", restaurantId, params],
    queryFn: () => getAllOrders(token, restaurantId, params),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};

export const usePendingOrdersQuery = (
  token: string,
  restaurantId: string | number,
  perPage: number = 12,
  page: number = 1,
  orderId?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "pending", restaurantId, perPage, page, orderId],
    queryFn: () => getPendingOrders(token, restaurantId, perPage, page, orderId),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};
