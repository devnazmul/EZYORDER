import { getDishes, getMenuAll, getMenuMatrix, getSingleMenu } from "@/apis/menu";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useMenuAllQuery = (token: string, restaurantId: string, params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MENU_ALL, restaurantId, params],
    queryFn: () => getMenuAll(token, restaurantId, params),
    enabled: !!token && !!restaurantId,
  });
};

export const useMenuMatrixQuery = (token: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MENU_MATRIX],
    queryFn: () => getMenuMatrix(token),
    enabled: !!token,
  });
};

export const useDishesQuery = (
  token: string,
  menuId: string | number | null,
  params: Record<string, any> = {},
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DISHES, menuId, params],
    queryFn: () => getDishes(token, menuId!, params),
    enabled: !!token && !!menuId,
  });
};

export const useSingleMenuQuery = (
  token: string,
  menuId: string | number | null,
  restaurantId: string | number | null,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_MENU, menuId, restaurantId],
    queryFn: () => getSingleMenu(token, menuId!, restaurantId!),
    enabled: !!token && !!menuId && !!restaurantId,
  });
};
