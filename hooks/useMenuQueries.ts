import { getMenuAll, getMenuMatrix } from "@/apis/menu";
import { useQuery } from "@tanstack/react-query";

export const useMenuAllQuery = (token: string, restaurantId: string) => {
  return useQuery({
    queryKey: ["menuAll", restaurantId],
    queryFn: () => getMenuAll(token, restaurantId),
    enabled: !!token && !!restaurantId,
  });
};

export const useMenuMatrixQuery = (token: string) => {
  return useQuery({
    queryKey: ["menuMatrix"],
    queryFn: () => getMenuMatrix(token),
    enabled: !!token,
  });
};
