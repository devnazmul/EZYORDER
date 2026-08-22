import { ICampaign } from "./campaign.types";
import { IMenuItem, IMenuTimeSlot } from "./menu.types";

export interface IVariationItem {
  id: number;
  name: string;
  description: string | null;
  type_id: number;
  price: string;
}

export interface IVariationType {
  id: number;
  name: string;
  description: string | null;
  restaurant_id: number;
  order_number: number;
  variation?: IVariationItem[];
}

export interface IDishVariation {
  id: number;
  minimum_variation_required: number;
  no_of_varation_allowed: number;
  type_id: number;
  dish_id: number;
  order_number: number;
  variation_type: IVariationType;
}

export interface IDishDeal {
  id: number;
  dish_id: number;
  name?: string;
  price?: string;
  description?: string | null;
}

export interface IDish {
  id: number;
  is_time_based: number;
  show_in_future_date: number;
  name: string;
  price: string;
  take_away_discounted_price: string;
  eat_in_discounted_price: string;
  delivery_discounted_price: string;
  restaurant_id: number;
  menu_id: number;
  image: string | null;
  description: string | null;
  take_away: string;
  delivery: string;
  type: string | null;
  ingredients: string | null;
  calories: string | number | null;
  order_number: number;
  preparation_time: number | null;
  is_active: number;
  take_away_calculated_price: number;
  delivery_calculated_price: number;
  eat_in_calculated_price: number;
  calculated_price: number;
  menu?: IMenuItem;
  dish_variations: IDishVariation[];
  deal: IDishDeal[];
  time_slots: IMenuTimeSlot[];
  campaigns: ICampaign[];
}
