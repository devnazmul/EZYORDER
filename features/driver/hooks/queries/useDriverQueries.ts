import { useQuery } from "@tanstack/react-query";
import {
  getDriverDashboardStats,
  getDriverActiveAssignedOrders,
  getOrderDetailById,
} from "../../apis/driver";

export const useDriverDashboardStatsQuery = (token: string) => {
  return useQuery({
    queryKey: ["driverDashboardStats"],
    queryFn: () => getDriverDashboardStats(token),
    enabled: !!token,
  });
};

export const useDriverActiveAssignedOrdersQuery = (token: string) => {
  return useQuery({
    queryKey: ["driverActiveAssignedOrders"],
    queryFn: () => getDriverActiveAssignedOrders(token),
    enabled: !!token,
  });
};

export const useOrderDetailQuery = (token: string, orderId: string | number, enabled: boolean) => {
  return useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => getOrderDetailById(token, orderId),
    enabled: enabled && !!token && !!orderId,
  });
};
