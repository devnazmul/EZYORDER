import type { IDish } from "@/types";
import type { DiscountType } from "./coupon.types";

export type CampaignCategoryType =
  | "buy_one_get_one_same"
  | "buy_one_get_one_other"
  | "spend_certain_amount"
  | "menu_discount"
  | "time_based_discount";

export interface ICampaignDishPivot {
  campaign_id: number;
  dish_id: number;
}

export interface ICampaignDish extends Partial<IDish> {
  pivot?: ICampaignDishPivot;
}

export interface ICampaign {
  id: number;
  business_id: number;
  name: string;
  type: CampaignCategoryType;
  discount_type: DiscountType | null;
  discount_amount: string;
  max_redemptions: number;
  customer_redemptions: number;
  campaign_start_date: string;
  campaign_end_date: string;
  campaign_start_time?: string | null;
  campaign_end_time?: string | null;
  is_active: number;
  spend_threshold?: string | null;
  created_at: string;
  updated_at: string;
  dishes?: ICampaignDish[];
  free_dishes?: ICampaignDish[];
  menus?: unknown[];
}
