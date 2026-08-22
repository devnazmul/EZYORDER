import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

// GET ALL COUPONS FOR A BUSINESS
export const getCoupons = async (
  token: string,
  businessId: number | string,
  perPage: number = 50,
  params: Record<string, any> = {},
) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/coupons/${businessId}/${perPage}`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  console.log("Coupons data fetched", response.data);
  return response.status === 200 && response.data ? response.data : null;
};

// GET ALL CAMPAIGNS FOR A RESTAURANT
export const getCampaigns = async (
  token: string,
  restaurantId: number | string,
  perPage: number = 50,
  params: Record<string, any> = {},
) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/campaigns/${restaurantId}/${perPage}`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  console.log("Campaigns data fetched", response.data);
  return response.status === 200 && response.data ? response.data : null;
};
