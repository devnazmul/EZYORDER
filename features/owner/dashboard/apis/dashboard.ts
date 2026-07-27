import ENV from "@/config/env";
import { logApiResponse } from "@/utils/logApiResponse";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const getDashboardMetric = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-metric`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Metrics", response.data);
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardLiveOrderBoard = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-live-order-board`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Live Order Board", response.data);
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardRevenueChart = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-revenue-chart`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Revenue Chart", response.data);
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardOrdersByType = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-orders-by-type`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Orders By Type", response.data);
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardKitchenActivity = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-kitchen-activity`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Kithen Activity", response.data);
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardCouponUsages = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-coupon-usages`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Coupoon Usages", response.data);
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardRecentOrders = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-recent-orders`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Recent Orders", response.data);
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardTopDishes = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-top-dishes`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  logApiResponse("Dashboard Top Dishes", response.data);
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};
