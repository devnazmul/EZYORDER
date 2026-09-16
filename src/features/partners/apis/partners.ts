// 3. External libraries / config
import axiosClient from "@/config/axiosClient";

// 6. Types
import type {
  GetDailyOrderPartnerSalesResponse,
  GetRestaurantPartnersResponse,
  IGetDailyOrderPartnerSalesParams,
  IGetRestaurantPartnersParams,
} from "../types/partnersAPI.types";

// GET ALL RESTAURANT PARTNERS
export const getRestaurantPartners = async (
  params: IGetRestaurantPartnersParams,
): Promise<GetRestaurantPartnersResponse> => {
  const response = await axiosClient.get<GetRestaurantPartnersResponse>(
    `/order/restaurant-partner/get-all/${params.restaurant_id}`,
    {
      validateStatus: (status) => status < 400,
    },
  );
  return response.data;
};

// GET ALL DAILY ORDER PARTNER SALES
export const getDailyOrderPartnerSales = async (
  params: IGetDailyOrderPartnerSalesParams,
): Promise<GetDailyOrderPartnerSalesResponse> => {
  const response = await axiosClient.get<GetDailyOrderPartnerSalesResponse>(
    `/order/daily-order-partner-sale/get-all/${params.restaurant_id}`,
    {
      validateStatus: (status) => status < 400,
    },
  );
  return response.data;
};
