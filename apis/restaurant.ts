import axios from "axios";
import ENV from "@/config/env";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

/**
 * Fetch restaurant settings by ID
 */
export const getRestaurant = async (token: string, id: string | number) => {
  const response = await axios.get(`${API_BASE_URL}/restaurant/${id}`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data ? response.data : null;
};

/**
 * Fetch business timings/days by restaurant ID
 */
export const getBusinessTiming = async (token: string, restaurantId: string | number) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/business-days/${restaurantId}`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data ? response.data : null;
};

/**
 * Fetch all combined menu/dishes/variations data
 */
export const getAllCombineData = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/menu-dishes-variationtypes-variations`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data ? response.data : null;
};
