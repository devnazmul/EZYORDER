import { QUERY_KEYS } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  getAllOrders,
  getPendingOrders,
  getTodayOrders,
} from "../../apis/orders";

export const useTodayOrdersQuery = (
  restaurantId: string | number,
  params: Record<string, any> = {},
  options?: { enabled?: boolean },
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "today", restaurantId, params],
    queryFn: () => getTodayOrders(token!, restaurantId, params),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};

export const useAllOrdersQuery = (
  restaurantId: string | number,
  params: Record<string, any> = {},
  options?: { enabled?: boolean },
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "all", restaurantId, params],
    queryFn: () => getAllOrders(token!, restaurantId, params),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};

export const usePendingOrdersQuery = (
  restaurantId: string | number,
  perPage: number = 12,
  page: number = 1,
  orderId?: string,
  options?: { enabled?: boolean },
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [
      QUERY_KEYS.ORDERS,
      "pending",
      restaurantId,
      perPage,
      page,
      orderId,
    ],
    queryFn: () =>
      getPendingOrders(token!, restaurantId, perPage, page, orderId),
    enabled: !!token && !!restaurantId && (options?.enabled ?? true),
  });
};
