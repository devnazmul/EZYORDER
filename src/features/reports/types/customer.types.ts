// ==========================================
// 1. Parameter Types
// ==========================================

export interface ICustomerParams {
  per_page?: number | string;
  page?: number | string;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  search_key?: string;
  rating?: number | string;
  frequency_visit?: string;
  date_filter?: string;
  name?: string;
  email?: string;
  phone?: string;
  order_by?: "ASC" | "DESC" | "asc" | "desc";
  last_visited_date?: string;
  status?: string;
  payment_status?: string;
  payment_type?: string;
  booking_type?: string;
}

// ==========================================
// 2. General / Entity Types
// ==========================================

export interface ICustomerOrderOverviewSummary {
  total_orders: number;
  total_revenue: number;
  avg_revenue: number;
  last_purchase_date: string;
}

export interface ICustomerOrderStatusOverview {
  completed: number;
  pending: number;
}

export interface ICustomerOrderTypeMetric {
  count: number;
  revenue: number;
  avg_value: number;
}

export interface ICustomerOrderOverviewTypes {
  take_away?: ICustomerOrderTypeMetric;
  delivery?: ICustomerOrderTypeMetric;
  eat_in?: ICustomerOrderTypeMetric;
  walk_in?: ICustomerOrderTypeMetric;
}

export interface ICustomerOrderOverviewSources {
  website?: number;
  in_store?: number;
}

export interface ICustomerOrderOverviewLoyalty {
  first_time?: number;
  returning?: number;
}

export interface ICustomerOrderOverview {
  summary?: ICustomerOrderOverviewSummary;
  status?: ICustomerOrderStatusOverview;
  types?: ICustomerOrderOverviewTypes;
  sources?: ICustomerOrderOverviewSources;
  loyalty?: ICustomerOrderOverviewLoyalty;
}

export interface ICustomerRole {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  business_id?: number | null;
  is_default?: number;
  is_system_default?: number;
  is_default_for_business?: number;
  description?: string;
  pivot?: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface ICustomer {
  id: number | string;
  first_Name?: string | null;
  last_Name?: string | null;
  phone?: string | null;
  email?: string | null;
  image?: string | null;
  type?: string | null;
  Address?: string | null;
  post_code?: string | null;
  door_no?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  business_id?: number | string | null;
  order_overview?: ICustomerOrderOverview;
  role?: ICustomerRole;
  total_orders?: number | string;
  total_revenue_takeaway?: number | string;
  total_revenue_delivery?: number | string;
  total_revenue_eat_in?: number | string;
  rating?: number | string;
  frequency_visit?: string;
  last_visited_date?: string;
  created_at?: string;
  status?: string;
  completed_orders_count?: number;
  [key: string]: unknown;
}

export interface ICustomerPaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  skip?: number;
  total_pages: number;
}

// ==========================================
// 3. Response Types
// ==========================================

export interface ICustomerListResponse {
  success: boolean;
  message: string;
  data: ICustomer[];
  meta: ICustomerPaginationMeta;
}
