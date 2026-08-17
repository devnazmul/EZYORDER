import { useQuery } from "@tanstack/react-query";
import { getExpenses, getExpenseTypes } from "@/features/owner/more/apis/expenses";
import { QUERY_KEYS } from "@/config/queryKeys";

export const useExpensesQuery = (
  token: string,
  restaurantId: number | string,
  perPage: number = 200,
  params: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSES, restaurantId, perPage, params],
    queryFn: () => getExpenses(token, restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};

export const useExpenseTypesQuery = (
  token: string,
  restaurantId: number | string,
  perPage: number = 1000,
  params: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_TYPES, restaurantId, perPage, params],
    queryFn: () => getExpenseTypes(token, restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};
