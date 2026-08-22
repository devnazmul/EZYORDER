import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

// GET ALL TABLES
export const getAllTables = async (token: string, params: Record<string, any> = {}) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/restaurant-tables`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  console.log(response.data);
  return response.status === 200 && response.data?.success ? response.data.data : [];
};

// GET TABLE MATRIX
export const getTableMatrix = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/restaurant-tables/matrix`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};

// GET SINGLE TABLE
export const getSingleTable = async (token: string, id: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/restaurant-tables/${id}`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};
