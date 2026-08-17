import { QUERY_KEYS } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  getDriverActiveAssignedOrders,
  getDriverDashboardStats,
  getDriverOrdersList,
  getOrderDetailById,
} from "../../apis/driver";

export const useDriverDashboardStatsQuery = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER_DASHBOARD_STATS],
    queryFn: () => getDriverDashboardStats(token!),
    enabled: !!token,
  });
};

export const useDriverActiveAssignedOrdersQuery = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER_ACTIVE_ASSIGNED_ORDERS],
    queryFn: () => getDriverActiveAssignedOrders(token!),
    enabled: !!token,
  });
};

export const useOrderDetailQuery = (
  orderId: string | number,
  enabled: boolean = true,
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId],
    queryFn: () => getOrderDetailById(token!, orderId),
    enabled: enabled && !!token && !!orderId,
  });
};

export const useDriverOrdersListQuery = (params: Record<string, any> = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER_ORDERS_LIST, params],
    queryFn: () => getDriverOrdersList(token!, params),
    enabled: !!token,
  });
};
