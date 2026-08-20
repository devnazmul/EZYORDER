// ==========================================
// 1. Parameter Types
// ==========================================

export interface IOrderTypeReportParams {
  start_date?: string;
  end_date?: string;
  restaurant_id?: string | number;
}

export interface IOrdersReportParams {
  per_page?: number;
  page?: number;
  from_date?: string;
  to_date?: string;
  start_time?: string;
  end_time?: string;
  min_amount?: string | number;
  max_amount?: string | number;
  customer_name?: string;
  customer_phone?: string;
  type?: string | string[];
  status?: string | string[];
  table_number?: string;
  order_id?: string;
  search_key?: string;
  restaurant_id?: string | number;
}

// ==========================================
// 2. General / Entity Types
// ==========================================

export interface IOrderSummaryPending {
  total: number;
  pending: number;
  kitchen: number;
  accepted?: number;
  picked_up?: number;
  en_route?: number;
}

export interface IOrderSummaryCancelled {
  total: number;
  delivery_failed?: number;
  by_restaurant?: number;
}

export interface IOrderSummarySales {
  completed_gross_sales: number;
  completed_net_sales: number;
  completed_discounts: number;
  cancelled_lost_sales: number;
  average_order_value: number;
}

export interface IOrderTypeMetric {
  order_count: number;
  sales: number;
}

export interface IOrderTypeBreakdown {
  delivery?: IOrderTypeMetric;
  eat_in?: IOrderTypeMetric;
  take_away?: IOrderTypeMetric;
  walk_in?: IOrderTypeMetric;
  [key: string]: IOrderTypeMetric | undefined;
}

export interface IOrderDetailVariation {
  id: number;
  name: string;
  description?: string | null;
  type_id: number;
  price: string | number;
  variation_type?: {
    id: number;
    name: string;
    description?: string | null;
    restaurant_id: number;
    order_number: number;
  };
}

export interface IOrderDetailDish {
  id: number;
  name: string;
  price: string | number;
  image?: string | null;
  description?: string | null;
  take_away?: string | number;
  delivery?: string | number;
  is_active?: number;
}

export interface IOrderDetailItem {
  id: number;
  type?: string;
  dish_price?: number | string;
  qty: number;
  order_id: number;
  dish_id: number;
  main_price?: string;
  dish?: IOrderDetailDish;
  variations?: {
    id: number;
    variation_id: number;
    variation?: IOrderDetailVariation;
  }[];
  [key: string]: unknown;
}

export interface IOrder {
  id: number | string;
  order_app?: string | null;
  table_number?: string | null;
  date?: string | null;
  restaurant_id?: number | string | null;
  status?: string | null;
  delivery_status?: string | null;
  delivery_photo?: string | null;
  delivery_signature?: string | null;
  delivery_otp?: string | null;
  is_otp_verified?: number;
  delivery_notes?: string | null;
  delivery_failure_reason?: string | null;
  delivery_failure_description?: string | null;
  payment_status?: string | null;
  total_due_amount?: string | number | null;
  amount?: string | number | null;
  tip_amount?: string | number | null;
  final_price?: string | number | null;
  total_price?: string | number | null;
  discount?: string | number | null;
  discount_type?: string | null;
  tax?: string | number | null;
  payment_method?: string | null;
  remarks?: string | null;
  type?: string | null;
  autoprint?: string | number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_post_code?: string | null;
  customer_address?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  order_by?: number | string | null;
  customer_id?: number | string | null;
  driver_id?: number | string | null;
  waiter_id?: number | string | null;
  cash?: string | number | null;
  card?: string | number | null;
  initial_note?: string | null;
  customer_note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  order_time?: string | null;
  door_no?: string | null;
  payment_intent_id?: string | null;
  restaurant?: Record<string, unknown>;
  detail?: IOrderDetailItem[];
  driver?: {
    id?: number | string;
    first_Name?: string;
    last_Name?: string;
    name?: string;
    phone?: string;
    [key: string]: unknown;
  } | null;
  waiter?: {
    id?: number | string;
    first_Name?: string;
    last_Name?: string;
    name?: string;
    phone?: string;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface IOrdersReportMeta {
  total: number;
  per_page: number;
  current_page: number;
  skip?: number;
  total_pages: number;
}

// ==========================================
// 3. Response Types
// ==========================================

export interface IOrderSummaryData {
  total_orders: number;
  completed_orders: number;
  pending: IOrderSummaryPending;
  cancelled: IOrderSummaryCancelled;
  sales: IOrderSummarySales;
}

export interface IOrderTypeReportData {
  total_order: number;
  total_sales: number;
  order_type_breakdown: IOrderTypeBreakdown;
}

export interface IOrdersReportListResponse {
  success: boolean;
  message: string;
  data: IOrder[];
  meta: IOrdersReportMeta;
}
