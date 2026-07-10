import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export interface SalesParams {
  restaurant_id: string;
  start_date: string;
  end_date: string;
  group_by?: "day" | "week" | "month";
}

export const getSalesSummary = async (token: string, params: SalesParams) => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/summary`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  console.log(response.data);
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getSalesTrend = async (token: string, params: SalesParams) => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/trend`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });

  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export const getSalesByOrderType = async (token: string, params: SalesParams) => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/by-order-type`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  console.log(response.data);
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

export interface CustomerParams {
  per_page: number | string;
  start_date?: string;
  end_date?: string;
  search_key?: string;
  rating?: number | string;
  frequency_visit?: string;
  date_filter?: string;
  name?: string;
  email?: string;
  phone?: string;
  order_by?: "ASC" | "DESC" | "asc" | "desc";
}

export const getCustomers = async (token: string, params: CustomerParams) => {
  const headers = getHeaders(token);
  const queryString = Object.keys(params)
    .filter((key) => params[key as keyof CustomerParams] !== undefined && params[key as keyof CustomerParams] !== "")
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key as keyof CustomerParams]))}`)
    .join("&");
  const completeUrl = `${API_BASE_URL}/v1.0/customers${queryString ? "?" + queryString : ""}`;

  console.log("Customers Request Sent:", {
    url: completeUrl,
    headers: headers,
  });

  const response = await axios.get(`${API_BASE_URL}/v1.0/customers`, {
    headers,
    params,
    validateStatus: () => true,
  });
  console.log("Customer Response", response.data);
  return response.status === 200 && Array.isArray(response.data?.data) ? response.data.data : [];
};
