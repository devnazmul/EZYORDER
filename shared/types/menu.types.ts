import { ICampaign } from "./campaign.types";
import { IDish, IVariationItem, IVariationType } from "./dish.types";

export interface IMenuQueryParams {
  business_id?: number | string | null;
  user_type?: string;
}

export interface IMenuTimeSlot {
  id: number;
  menu_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface IMenuItem {
  id: number;
  is_time_based: number;
  name: string;
  description: string | null;
  restaurant_id: number;
  order_number: number;
  icon: string | null;
  show_in_customer: number;
  time_slots?: IMenuTimeSlot[];
  campaigns?: ICampaign[];
}

export interface IMenuCatalogResponse {
  menu: IMenuItem[];
  dishes: IDish[];
  variation_types: IVariationType[];
  variations: IVariationItem[];
}
