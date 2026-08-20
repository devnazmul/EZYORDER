// ==========================================
// 1. Parameter Types
// ==========================================

export interface ISalesParams {
  restaurant_id: string;
  start_date: string;
  end_date: string;
  group_by?: "day" | "week" | "month";
}

// ==========================================
// 2. General / Entity Types
// ==========================================

export interface ISalesTrendItem {
  label: string;
  sales: string | number;
  orders: number;
}

export interface ISalesByOrderTypeItem {
  order_type?: string;
  total_sales?: number | string;
  total_orders?: number | string;
  percentage?: number | string;
  [key: string]: unknown;
}

export interface ITopProductItem {
  item_name: string;
  quantity_sold: number;
}

export interface ISalesOrderTypeSummaryItem {
  total_orders: number;
  total_amount: number;
}

export interface ISalesOrderTypeSummary {
  delivery?: ISalesOrderTypeSummaryItem;
  eat_in?: ISalesOrderTypeSummaryItem;
  take_away?: ISalesOrderTypeSummaryItem;
  walk_in?: ISalesOrderTypeSummaryItem;
  [key: string]: ISalesOrderTypeSummaryItem | undefined;
}

export interface ISalesSummaryData {
  gross_sales: number;
  discounts: number;
  total_tax: number;
  net_sales: number;
  total_expenses: number;
  profit: number;
  total_orders: number;
  average_order_value: number;
  total_guests: number;
  order_type_summary?: ISalesOrderTypeSummary;
}

// ==========================================
// 3. Response Types
// ==========================================

export interface ISalesSummaryResponse {
  success: boolean;
  message: string;
  data: ISalesSummaryData;
}

export interface ISalesTrendResponse {
  success: boolean;
  message: string;
  data: ISalesTrendItem[];
}

export interface ISalesByItemResponse {
  success: boolean;
  message: string;
  data: ITopProductItem[];
}
