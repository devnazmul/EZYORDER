import ENV from "@/config/env";
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
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardLiveOrderBoard = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-live-order-board`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardRevenueChart = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-revenue-chart`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });

  // Temporary mock data for UI testing since API is sending empty values
  const mockWeek = [
    { name: "Mon", value: 120 },
    { name: "Tue", value: 150 },
    { name: "Wed", value: 80 },
    { name: "Thu", value: 220 },
    { name: "Fri", value: 310 },
    { name: "Sat", value: 450 },
    { name: "Sun", value: 380 },
  ];

  const mockMonth = Array.from({ length: 31 }, (_, i) => ({
    name: `${String(i + 1).padStart(2, "0")} Jul`,
    value: Math.floor(Math.sin((i + 1) * 0.5) * 150) + 250,
  }));

  const apiData = response.status === 200 && response.data?.success ? response.data.data || [] : [];

  // If the API data is empty or all values are 0, use mock data temporarily
  const hasData = apiData.some((d: any) => parseFloat(d.value) > 0);
  if (!hasData) {
    return filterBy === "this_week" ? mockWeek : mockMonth;
  }
  return apiData;
};

export const getDashboardOrdersByType = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-orders-by-type`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardKitchenActivity = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-kitchen-activity`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getDashboardCouponUsages = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-coupon-usages`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  console.log(response.data);
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardRecentOrders = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-recent-orders`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  console.log(response.data);
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};

export const getDashboardTopDishes = async (token: string, filterBy: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/dashboard-top-dishes`, {
    headers: getHeaders(token),
    params: { date_filter: filterBy },
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data || [] : [];
};
