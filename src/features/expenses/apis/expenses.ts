// 3. External libraries / config
import axiosClient from "@/config/axiosClient";

// 6. Types
import type {
  IExpenseListParams,
  IExpenseListResponse,
  IExpenseMatrixParams,
  IExpenseMatrixResponse,
  IExpenseTrendParams,
  IExpenseTrendResponse,
  IExpenseTypesParams,
  IExpenseTypesResponse,
  IPaymentMethodBreakdownParams,
  IPaymentMethodBreakdownResponse,
} from "../types/expenses.types";

// GET ALL EXPENSES FOR A RESTAURANT
export const getExpenses = async (
  restaurantId: number | string,
  perPage: number = 200,
  params: Partial<IExpenseListParams> = {},
): Promise<IExpenseListResponse | null> => {
  const mergedParams = {
    order_by: "asc",
    start_date: "",
    end_date: "",
    search_key: "",
    min_amount: "",
    max_amount: "",
    payment_method: "",
    supplier_id: "",
    is_active: "",
    ...params,
  };
  const response = await axiosClient.get<IExpenseListResponse>(
    `/v1.0/expenses/${restaurantId}/${perPage}`,
    {
      params: mergedParams,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET ALL EXPENSE TYPES FOR A RESTAURANT
export const getExpenseTypes = async (
  restaurantId: number | string,
  perPage: number = 1000,
  params: Partial<IExpenseTypesParams> = {},
): Promise<IExpenseTypesResponse | null> => {
  const response = await axiosClient.get<IExpenseTypesResponse>(
    `/v1.0/expense-types/${restaurantId}/${perPage}`,
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET ALL EXPENSE MATRIX (KPI SUMMARY)
export const getExpenseMatrix = async (
  params: IExpenseMatrixParams = {},
): Promise<IExpenseMatrixResponse | null> => {
  const response = await axiosClient.get<IExpenseMatrixResponse>(
    "/v1.0/expenses/matrix",
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET EXPENSE PAYMENT METHOD BREAKDOWN
export const getExpensePaymentMethodBreakdown = async (
  params: IPaymentMethodBreakdownParams = {},
): Promise<IPaymentMethodBreakdownResponse | null> => {
  const response = await axiosClient.get<IPaymentMethodBreakdownResponse>(
    "/v1.0/expenses/payment-method-breakdown",
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};

// GET EXPENSE TREND
export const getExpenseTrend = async (
  params: IExpenseTrendParams = {},
): Promise<IExpenseTrendResponse | null> => {
  const response = await axiosClient.get<IExpenseTrendResponse>(
    "/v1.0/expenses/trend",
    {
      params,
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data ? response.data : null;
};
