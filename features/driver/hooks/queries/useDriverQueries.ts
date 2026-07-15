import { useQuery } from "@tanstack/react-query";
import { getDriverDashboardStats, getDriverActiveAssignedOrders } from "../../apis/driver";

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
