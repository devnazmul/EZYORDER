// 1. React / React Native & TanStack Query
import { useQuery } from "@tanstack/react-query";

// 2. Navigation / Context
import { useAuth } from "@/src/context/AuthContext";

// 5. Feature API & Types
import {
  getAllTables,
  getTableMatrix,
} from "@/features/tables-and-reservations/apis/tables";
import type { IGetTablesQueryParams } from "../../types/tableApi.types";

// 7. Constants
import { TABLE_KEYS } from "@/constants/queryKeys";

export const useAllTablesQuery = (params: IGetTablesQueryParams = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: TABLE_KEYS.list(params),
    queryFn: () => getAllTables(params),
    enabled: !!token,
  });
};

export const useTableMatrixQuery = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: TABLE_KEYS.matrix(),
    queryFn: () => getTableMatrix(),
    enabled: !!token,
  });
};
