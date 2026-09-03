import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getDishes,
  getMenuAll,
  getMenuMatrix,
  getSingleMenu,
} from "@/features/menu/apis/menu";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";

export const useMenuAllQuery = (
  restaurantId: string,
  params: Record<string, any> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.MENU_ALL, restaurantId, params],
    queryFn: () => getMenuAll(token!, restaurantId, params),
    enabled: !!token && !!restaurantId,
  });
};

export const useMenuMatrixQuery = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.MENU_MATRIX],
    queryFn: () => getMenuMatrix(token!),
    enabled: !!token,
  });
};

export const useDishesQuery = (
  menuId: string | number | null,
  params: Record<string, any> = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.DISHES, menuId, params],
    queryFn: () => getDishes(token!, menuId!, params),
    enabled: !!token && !!menuId,
  });
};

export const useSingleMenuQuery = (
  menuId: string | number | null,
  restaurantId: string | number | null,
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_MENU, menuId, restaurantId],
    queryFn: () => getSingleMenu(token!, menuId!, restaurantId!),
    enabled: !!token && !!menuId && !!restaurantId,
  });
};
