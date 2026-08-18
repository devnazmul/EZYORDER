import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

// GET ALL RESTAURANT PARTNERS
export const getRestaurantPartners = async (token: string, restaurantId: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/order/restaurant-partner/get-all/${restaurantId}`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  console.log("Restaurant Partners Response:", response.data);
  return response.status === 200 && response.data ? response.data : [];
};

// GET ALL DAILY ORDER PARTNER SALES
export const getDailyOrderPartnerSales = async (token: string, restaurantId: number | string) => {
  const response = await axios.get(
    `${API_BASE_URL}/order/daily-order-partner-sale/get-all/${restaurantId}`,
    {
      headers: getHeaders(token),
      validateStatus: () => true,
    }
  );
  console.log("Daily Order Partner Sales Response:", response.data);
  return response.status === 200 && response.data ? response.data : [];
};
