import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

// GET ALL EXPENSES FOR A RESTAURANT
export const getExpenses = async (
  token: string,
  restaurantId: number | string,
  perPage: number = 200,
  params: Record<string, any> = {},
) => {
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
  const response = await axios.get(`${API_BASE_URL}/v1.0/expenses/${restaurantId}/${perPage}`, {
    headers: getHeaders(token),
    params: mergedParams,
    validateStatus: () => true,
  });
  console.log("Expenses data fetched", response.data);
  return response.status === 200 && response.data ? response.data : null;
};

// GET ALL EXPENSE TYPES FOR A RESTAURANT
export const getExpenseTypes = async (
  token: string,
  restaurantId: number | string,
  perPage: number = 1000,
  params: Record<string, any> = {},
) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/expense-types/${restaurantId}/${perPage}`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  console.log("Expense types data fetched", response.data);
  return response.status === 200 && response.data ? response.data : null;
};
