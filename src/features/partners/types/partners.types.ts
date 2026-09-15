export interface IRestaurantPartnerDetails {
  id?: number;
  name: string;
  description?: string | null;
  webpage_link?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active?: number;
}

export interface IPartnerContactDetails {
  contact_person?: string | null;
  contact_number?: string | null;
}

export interface IRestaurantPartner {
  id: number;
  delivery: number;
  delivery_order_commission: string;
  delivery_shop_link: string | null;
  eat_in: number;
  eat_in_order_commission: string;
  eat_in_shop_link: string | null;
  takeaway: number;
  takeaway_order_commission: string;
  takeaway_link: string | null;
  contact_details: IPartnerContactDetails;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
  api_key: string | null;
  payment_terms: string | null;
  is_active: number;
  restaurant_partner_id: number | null;
  restaurant_partner: IRestaurantPartnerDetails;
}

export interface IDailyOrderPartnerSale {
  id: number;
  restaurant_id: number;
  restaurant_partner_id: string | null;
  eat_in_orders: number;
  eat_in_orders_amount: string | number;
  takeaway_orders: number;
  takeaway_orders_amount: string | number;
  delivery_orders: number;
  delivery_orders_amount?: string | number;
  bank_payment?: string | number | null;
  cash_payment?: string | number | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  restaurant_partner?: IRestaurantPartnerDetails | null;
}
