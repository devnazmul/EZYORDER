// 3. External libraries
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// 4. Shared context
import { useAuth } from "@/context/AuthContext";

// 5. Feature apis
import {
  getExpenseMatrix,
  getExpensePaymentMethodBreakdown,
  getExpenses,
  getExpenseTrend,
  getExpenseTypes,
} from "@/features/expenses/apis/expenses";

// 6. Types
import type {
  IExpenseListParams,
  IExpenseListResponse,
  IExpenseMatrixParams,
  IExpenseTrendParams,
  IExpenseTypesParams,
  IExpenseTypesResponse,
  IPaymentMethodBreakdownParams,
} from "@/features/expenses/types";

// 7. Constants/utils
import { EXPENSE_KEYS } from "@/constants/queryKeys";

export const useExpensesQuery = (
  restaurantId: number | string,
  perPage: number = 20,
  params: Partial<IExpenseListParams> = {},
) => {
  const { token } = useAuth();
  const { page, ...paramsWithoutPage } = params;

  return useInfiniteQuery({
    queryKey: EXPENSE_KEYS.list({
      restaurantId,
      perPage,
      ...paramsWithoutPage,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getExpenses(restaurantId, perPage, {
        ...paramsWithoutPage,
        page: Number(pageParam),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: IExpenseListResponse) => {
      if (!lastPage) return undefined;

      const currentPage = Number(lastPage.meta?.current_page ?? 1);
      const totalPages = Number(lastPage.meta?.total_pages ?? 0);

      if (currentPage > 0 && totalPages > 0 && currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
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

export const useExpenseTypesInfiniteQuery = (
  restaurantId: number | string,
  perPage: number = 20,
  params: Partial<IExpenseTypesParams> = {},
) => {
  const { token } = useAuth();
  const { page, ...paramsWithoutPage } = params;

  return useInfiniteQuery({
    queryKey: EXPENSE_KEYS.typeList({
      restaurantId,
      perPage,
      ...paramsWithoutPage,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getExpenseTypes(restaurantId, perPage, {
        ...paramsWithoutPage,
        page: Number(pageParam),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: IExpenseTypesResponse) => {
      if (!lastPage) return undefined;

      const currentPage = Number(lastPage.current_page ?? 1);
      const totalPages = Number(lastPage.last_page ?? 0);

      if (currentPage > 0 && totalPages > 0 && currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
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

export const useExpensePaymentMethodBreakdownQuery = (
  params: IPaymentMethodBreakdownParams = {},
  enabled: boolean = true,
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: EXPENSE_KEYS.paymentMethodBreakdown(params),
    queryFn: () => getExpensePaymentMethodBreakdown(params),
    enabled: !!token && enabled,
  });
};

export const useExpenseTrendQuery = (
  params: IExpenseTrendParams = {},
  enabled: boolean = true,
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: EXPENSE_KEYS.trend(params),
    queryFn: () => getExpenseTrend(params),
    enabled: !!token && enabled,
  });
};
