import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getExpenses,
  getExpenseTypes,
} from "@/features/owner/more/apis/expenses";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useExpensesQuery = (
  restaurantId: number | string,
  perPage: number = 200,
  params: Record<string, any> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSES, restaurantId, perPage, params],
    queryFn: () => getExpenses(token!, restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};

export const useExpenseTypesQuery = (
  restaurantId: number | string,
  perPage: number = 1000,
  params: Record<string, any> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_TYPES, restaurantId, perPage, params],
    queryFn: () => getExpenseTypes(token!, restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};
