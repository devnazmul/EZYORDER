export interface IRestaurantQueryParams {
  restaurant_id?: number | string | null;
}

export interface IPaymentModeConfig {
  cash: number;
  stripe: number;
}

export interface IRestaurantOwner {
  id: number;
  first_Name: string;
  last_Name: string;
  phone: string;
  image: string | null;
  type: string;
  driver_status: string;
  waiter_status: string;
  post_code: string | null;
  Address: string | null;
  latitude: number | null;
  longitude: number | null;
  email: string;
  stripe_id: string | null;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  door_no: string | null;
  business_id: number;
}

export interface IRestaurant {
  id: number;
  Name: string;
  currency: string;
  time_zone: string | null;
  About: string | null;
  Webpage: string | null;
  PhoneNumber: string | null;
  EmailAddress: string | null;
  homeText: string | null;
  AdditionalInformation: string | null;
  GoogleMapApi: string | null;
  Address: string | null;
  PostCode: string | null;
  Logo: string;
  OwnerID: number;
  Key_ID: string;
  expiry_date: string | null;
  totalTables: number;
  Status: string;
  Layout: string;
  enable_question: number;
  is_eat_in: number;
  is_delivery: number;
  is_take_away: number;
  is_customer_order: number;
  Is_guest_user: number;
  is_review_silder: number;
  review_only: number;
  review_type: string;
  google_map_iframe: string | null;
  is_business_type_restaurant: number;
  business_type: string;
  header_image: string | null;
  rating_page_image: string | null;
  placeholder_image: string | null;
  menu_pdf: string | null;
  is_pdf_manu: number;
  primary_color: string | null;
  secondary_color: string | null;
  client_primary_color: string | null;
  client_secondary_color: string | null;
  client_tertiary_color: string | null;
  user_review_report: number;
  guest_user_review_report: number;
  enable_customer_order_payment: number;
  eat_in_payment_mode: IPaymentModeConfig;
  takeaway_payment_mode: IPaymentModeConfig;
  delivery_payment_mode: IPaymentModeConfig;
  is_customer_order_enabled: number;
  is_report_email_enabled: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  is_customer_schedule_order: number;
  show_image: number;
  tax_percentage: string;
  average_collection_time: string | null;
  average_delivery_time: string | null;
  delivery_radius: number | string | null;
  minimum_delivery_amount: string | null;
  latitude: number | null;
  longitude: number | null;
  owner?: IRestaurantOwner;
}

export interface IRestaurantResponse {
  restaurant: IRestaurant;
  ok?: boolean;
}
