import { useQuery } from "@tanstack/react-query";
import {
  getDashboardMetric,
  getDashboardLiveOrderBoard,
  getDashboardRevenueChart,
  getDashboardOrdersByType,
  getDashboardKitchenActivity,
  getDashboardCouponUsages,
  getDashboardRecentOrders,
  getDashboardTopDishes,
} from "@/apis/dashboard";

export const useDashboardMetric = (token: string, filterBy: string) => {
  return useQuery({
    queryKey: ["dashboardMetrics", filterBy],
    queryFn: () => getDashboardMetric(token, filterBy),
    enabled: !!token,
  });
};

export const useDashboardLiveOrderBoard = (token: string) => {
  return useQuery({
    queryKey: ["dashboardLiveOrderBoard"],
    queryFn: () => getDashboardLiveOrderBoard(token),
    enabled: !!token,
  });
};

export const useDashboardRevenueChart = (token: string, filterBy: string) => {
  return useQuery({
    queryKey: ["dashboardRevenueChart", filterBy],
    queryFn: () => getDashboardRevenueChart(token, filterBy),
    enabled: !!token,
  });
};

export const useDashboardOrdersByType = (token: string, filterBy: string) => {
  return useQuery({
    queryKey: ["dashboardOrdersByTypeChart", filterBy],
    queryFn: () => getDashboardOrdersByType(token, filterBy),
    enabled: !!token,
  });
};

export const useDashboardKitchenActivity = (token: string) => {
  return useQuery({
    queryKey: ["dashboardKitchenActivityCard"],
    queryFn: () => getDashboardKitchenActivity(token),
    enabled: !!token,
  });
};

export const useDashboardPromotions = (token: string) => {
  return useQuery({
    queryKey: ["dashboardPromotionsTable"],
    queryFn: () => getDashboardCouponUsages(token),
    enabled: !!token,
  });
};

export const useDashboardRecentOrders = (token: string) => {
  return useQuery({
    queryKey: ["dashboardRecentOrdersTable"],
    queryFn: () => getDashboardRecentOrders(token),
    enabled: !!token,
  });
};

export const useDashboardTopDishes = (token: string, filterBy: string) => {
  return useQuery({
    queryKey: ["dashboardTopDishesPerformance", filterBy],
    queryFn: () => getDashboardTopDishes(token, filterBy),
    enabled: !!token,
  });
};
