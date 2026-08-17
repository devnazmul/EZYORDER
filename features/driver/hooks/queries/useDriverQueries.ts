import { QUERY_KEYS } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import {
  getDriverActiveAssignedOrders,
  getDriverDashboardStats,
  getDriverOrdersList,
  getOrderDetailById,
} from "../../apis/driver";

export const useDriverDashboardStatsQuery = (token: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER_DASHBOARD_STATS],
    queryFn: () => getDriverDashboardStats(token),
    enabled: !!token,
  });
};

export const useDriverActiveAssignedOrdersQuery = (token: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER_ACTIVE_ASSIGNED_ORDERS],
    queryFn: () => getDriverActiveAssignedOrders(token),
    enabled: !!token,
  });
};

export const useOrderDetailQuery = (
  token: string,
  orderId: string | number,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId],
    queryFn: () => getOrderDetailById(token, orderId),
    enabled: enabled && !!token && !!orderId,
  });
};

export const useDriverOrdersListQuery = (
  token: string,
  params: Record<string, any> = {},
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER_ORDERS_LIST, params],
    queryFn: () => getDriverOrdersList(token, params),
    enabled: !!token,
  });
};
