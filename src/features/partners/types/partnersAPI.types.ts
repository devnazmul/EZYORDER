// 6. Types
import type {
  IDailyOrderPartnerSale,
  IRestaurantPartner,
} from "./partners.types";

export interface IGetRestaurantPartnersParams {
  restaurant_id: number | string;
}

export interface IGetDailyOrderPartnerSalesParams {
  restaurant_id: number | string;
}

export type GetRestaurantPartnersResponse = IRestaurantPartner[];
export type GetDailyOrderPartnerSalesResponse = IDailyOrderPartnerSale[];
