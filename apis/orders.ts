import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

const flattenOrders = (rawData: any) => {
  let flattenedOrders: any[] = [];
  if (Array.isArray(rawData)) {
    flattenedOrders = rawData;
  } else if (typeof rawData === "object" && rawData !== null) {
    Object.keys(rawData).forEach((key) => {
      if (Array.isArray(rawData[key])) {
        flattenedOrders = [...flattenedOrders, ...rawData[key]];
      }
    });
  }
  return flattenedOrders;
};

// GET TODAY'S LIVE ORDERS
export const getTodayOrders = async (
  token: string,
  restaurantId: string | number,
  params: Record<string, any> = {},
) => {
  const response = await axios.get(`${API_BASE_URL}/order/All/order/today/${restaurantId}`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });

  if (response.status === 200 && response.data) {
    return flattenOrders(response.data.data || response.data);
  }
  return [];
};

// // GET ALL HISTORICAL ORDERS
export const getAllOrders = async (
  token: string,
  restaurantId: string | number,
  params: Record<string, any> = {},
) => {
  const response = await axios.get(`${API_BASE_URL}/v3.0/order/All/order/every/${restaurantId}`, {
    headers: getHeaders(token),
    params: { per_page: 50, page: 1, ...params },
    validateStatus: () => true,
  });
  console.log(response.headers);
  if (response.status === 200 && response.data) {
    return flattenOrders(response.data.data || response.data);
  }
  return [];
};

// GET KITCHEN PENDING ORDERS
export const getPendingOrders = async (
  token: string,
  restaurantId: string | number,
  perPage: number = 12,
  page: number = 1,
  orderId?: string,
) => {
  const params: Record<string, any> = { page };
  if (orderId) {
    params.order_id = orderId;
  }
  const response = await axios.get(`${API_BASE_URL}/order/All/pending/order/${restaurantId}/${perPage}`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });

  if (response.status === 200 && response.data) {
    return response.data;
  }
  return null;
};
