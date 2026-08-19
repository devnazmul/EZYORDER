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

export interface ISalesSummaryData {
  gross_sales?: number | string;
  discounts?: number | string;
  discount?: number | string;
  refunds?: number | string;
  net_sales?: number | string;
  total_expenses?: number | string;
  expenses?: number | string;
  total_tax?: number | string;
  tax?: number | string;
  tax_collected?: number | string;
  profit?: number | string;
  total_orders?: number;
  [key: string]: unknown;
}

export interface IOrderSummaryData {
  total_orders?: number;
  completed_orders?: number;
  pending?: {
    total?: number;
    [key: string]: unknown;
  };
  cancelled?: {
    total?: number;
    [key: string]: unknown;
  };
  sales?: {
    average_order_value?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ISalesTrendItem {
  date?: string;
  label?: string;
  sales?: number | string;
  orders?: number | string;
  [key: string]: unknown;
}

export interface ISalesByOrderTypeItem {
  order_type?: string;
  total_sales?: number | string;
  total_orders?: number | string;
  percentage?: number | string;
  [key: string]: unknown;
}

export interface ITopProductItem {
  item_name?: string;
  quantity_sold?: number | string;
  net_sales?: number | string;
  percent?: string;
  [key: string]: unknown;
}

export interface ICustomerData {
  id?: string | number;
  first_Name?: string;
  last_Name?: string;
  email?: string;
  phone?: string;
  image?: string;
  total_orders?: number | string;
  total_revenue_takeaway?: number | string;
  total_revenue_delivery?: number | string;
  total_revenue_eat_in?: number | string;
  rating?: number | string;
  frequency_visit?: string;
  last_visited_date?: string;
  created_at?: string;
  status?: string;
  [key: string]: unknown;
}

export const getSalesSummary = async (
  token: string,
  params: ISalesParams,
): Promise<ISalesSummaryData | null> => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/summary`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};

export const getOrderSummary = async (
  token: string,
  params: ISalesParams,
): Promise<IOrderSummaryData | null> => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/orders/summary`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : response.data?.data || null;
};

export const getSalesTrend = async (
  token: string,
  params: ISalesParams,
): Promise<ISalesTrendItem[] | null> => {
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
): Promise<ISalesByOrderTypeItem[] | Record<string, unknown> | null> => {
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

export const getCustomers = async (
  token: string,
  params: ICustomerParams,
): Promise<ICustomerData[]> => {
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
export const getSalesByItem = async (
  token: string,
  params: ISalesParams,
): Promise<ITopProductItem[] | null> => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales/by-item`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};
