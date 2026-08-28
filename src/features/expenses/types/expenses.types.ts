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
  is_active: number;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
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
