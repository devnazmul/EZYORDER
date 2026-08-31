export interface IExpenseListParams {
  restaurantId?: number | string;
  perPage?: number;
  page?: number;
  order_by?: "ASC" | "DESC";
  start_date?: string;
  end_date?: string;
  search_key?: string;
  min_amount?: number | string;
  max_amount?: number | string;
  payment_method?: string;
  expense_type?: number | string | (number | string)[];
  supplier_id?: number | string;
  paid_by?: string;
  note?: string;
  description?: string;
  is_active?: number | string | (number | string)[];
}

export interface IExpenseTypesParams {
  restaurantId?: number | string;
  perPage?: number;
  page?: number;
}

export interface IExpenseMatrixParams {
  start_date?: string;
  end_date?: string;
}

export interface ITopExpenseType {
  id: number;
  name: string;
  description?: string | null;
  is_active?: number;
  restaurant_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IExpenseType {
  id: number;
  name: string;
  description?: string | null;
  is_active?: number;
  restaurant_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IExpenseReceipt {
  id?: number | string;
  url?: string;
  path?: string;
  file?: string;
}

export interface IExpense {
  id: number;
  generated_id?: string;
  amount: string | number;
  payment_method: string;
  payment_date: string;
  note?: string | null;
  description?: string | null;
  paid_by?: string | null;
  shareable_link?: string | null;
  expense_type: IExpenseType | string | number;
  reciepts?: IExpenseReceipt[];
  restaurant_id?: number;
  supplier_id?: number | null;
  receipt_by?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active?: number;
  supplier?: unknown;
}

export interface IExpenseListResponse {
  success: boolean;
  message: string;
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
  data: IExpense[];
}

export interface IExpenseTypesResponse {
  current_page?: number;
  data: IExpenseType[];
  total?: number;
}

export interface ITopExpenseTypeData {
  name: ITopExpenseType | string;
  total_spent: string;
}

export interface IExpenseMatrixData {
  total_expenses: string;
  total_transactions: number;
  average_expense_amount: number;
  top_expense_type?: ITopExpenseTypeData | null;
}

export interface IExpenseMatrixResponse {
  success: boolean;
  message: string;
  data: IExpenseMatrixData;
}
export interface IPaymentMethodBreakdownParams {
  start_date?: string;
  end_date?: string;
}

export interface IPaymentMethodBreakdownItem {
  payment_method: string;
  count: number;
  total: string;
  percentage: number;
}

export interface IPaymentMethodBreakdownResponse {
  success: boolean;
  message: string;
  data: IPaymentMethodBreakdownItem[];
}

export interface IExpenseTrendParams {
  start_date?: string;
  end_date?: string;
}

export interface IExpenseTrendItem {
  date: string;
  total_spent: string;
}

export interface IExpenseTrendResponse {
  success: boolean;
  message: string;
  data: IExpenseTrendItem[];
}
