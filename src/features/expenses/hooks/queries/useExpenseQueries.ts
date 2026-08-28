// 3. External libraries
import { useQuery } from "@tanstack/react-query";

// 4. Shared context
import { useAuth } from "@/src/context/AuthContext";

// 5. Feature apis
import {
  getExpenseMatrix,
  getExpenses,
  getExpenseTypes,
} from "@/features/expenses/apis/expenses";

// 6. Types
import type {
  IExpenseListParams,
  IExpenseMatrixParams,
  IExpenseTypesParams,
} from "@/features/expenses/types";

// 7. Constants/utils
import { EXPENSE_KEYS } from "@/constants/queryKeys";

export const useExpensesQuery = (
  restaurantId: number | string,
  perPage: number = 200,
  params: Partial<IExpenseListParams> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: EXPENSE_KEYS.list({ restaurantId, perPage, ...params }),
    queryFn: () => getExpenses(restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};

export const useExpenseTypesQuery = (
  restaurantId: number | string,
  perPage: number = 1000,
  params: Partial<IExpenseTypesParams> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: EXPENSE_KEYS.typeList({ restaurantId, perPage, ...params }),
    queryFn: () => getExpenseTypes(restaurantId, perPage, params),
    enabled: !!token && !!restaurantId,
  });
};

export const useExpenseMatrixQuery = (
  params: IExpenseMatrixParams = {},
  enabled: boolean = true,
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: EXPENSE_KEYS.matrix(params),
    queryFn: () => getExpenseMatrix(params),
    enabled: !!token && enabled,
  });
};
