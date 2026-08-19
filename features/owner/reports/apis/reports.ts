import { ENV } from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export interface ISalesParams {
  restaurant_id: string;
  start_date: string;
  end_date: string;
  group_by?: "day" | "week" | "month";
}

export const getSalesSummary = async (token: string, params: ISalesParams) => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/summary`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

export const getOrderSummary = async (token: string, params: ISalesParams) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/orders/summary`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : response.data?.data || null;
};

export const getSalesTrend = async (token: string, params: ISalesParams) => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/trend`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });

  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

export const getSalesByOrderType = async (
  token: string,
  params: ISalesParams,
) => {
  const response = await axios.get(
    `${API_BASE_URL}/reports/sales/by-order-type`,
    {
      headers: getHeaders(token),
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

export interface ICustomerParams {
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
  last_visited_date?: string;
  status?: string;
  payment_status?: string;
  payment_type?: string;
  booking_type?: string;
}

export const getCustomers = async (token: string, params: ICustomerParams) => {
  const headers = getHeaders(token);
  const queryString = Object.keys(params)
    .filter(
      (key) =>
        params[key as keyof ICustomerParams] !== undefined &&
        params[key as keyof ICustomerParams] !== "",
    )
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key as keyof ICustomerParams]))}`,
    )
    .join("&");

  const response = await axios.get(
    `${API_BASE_URL}/v1.0/customers${queryString ? "?" + queryString : ""}`,
    {
      headers,
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && Array.isArray(response.data?.data)
    ? response.data.data
    : [];
};

// Fetch sales breakdown by individual menu items
export const getSalesByItem = async (token: string, params: ISalesParams) => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/by-item`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};
