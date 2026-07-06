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
