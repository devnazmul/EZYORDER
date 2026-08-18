import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getReservations,
  getSingleReservation,
} from "@/features/owner/more/apis/reservations";
import {
  getAllTables,
  getSingleTable,
  getTableMatrix,
} from "@/features/owner/more/apis/tables";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

// ─── TABLE HOOKS ────────────────────────────────────────────────

export const useAllTablesQuery = (params: Record<string, any> = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.TABLES, params],
    queryFn: () => getAllTables(token!, params),
    enabled: !!token,
  });
};

export const useTableMatrixQuery = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.TABLE_MATRIX],
    queryFn: () => getTableMatrix(token!),
    enabled: !!token,
  });
};

export const useSingleTableQuery = (id: number | string) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_TABLE, id],
    queryFn: () => getSingleTable(token!, id),
    enabled: !!token && !!id,
  });
};

// ─── RESERVATION HOOKS ─────────────────────────────────────────

export const useReservationsQuery = (params: Record<string, any> = {}) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.RESERVATIONS, params],
    queryFn: () => getReservations(token!, params),
    enabled: !!token,
  });
};

export const useSingleReservationQuery = (id: number | string) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_RESERVATION, id],
    queryFn: () => getSingleReservation(token!, id),
    enabled: !!token && !!id,
  });
};
