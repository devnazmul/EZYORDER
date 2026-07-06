import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const getMenuAll = async (token: string, restaurantId: string) => {
  const response = await axios.get(`${API_BASE_URL}/menu/AllbuId/${restaurantId}`, {
    headers: getHeaders(token),
    params: {
      response_type: "json",
      file_name: "menu",
    },
    validateStatus: () => true,
  });
  return response.status === 200 ? response.data : null;
};

export const getMenuMatrix = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/menu-matrix`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};
