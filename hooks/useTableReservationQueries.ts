import { getReservations, getSingleReservation } from "@/apis/reservations";
import { getAllTables, getSingleTable, getTableMatrix } from "@/apis/tables";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useQuery } from "@tanstack/react-query";

// ─── TABLE HOOKS ────────────────────────────────────────────────

export const useAllTablesQuery = (token: string, params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TABLES, params],
    queryFn: () => getAllTables(token, params),
    enabled: !!token,
  });
};

export const useTableMatrixQuery = (token: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TABLE_MATRIX],
    queryFn: () => getTableMatrix(token),
    enabled: !!token,
  });
};

export const useSingleTableQuery = (token: string, id: number | string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_TABLE, id],
    queryFn: () => getSingleTable(token, id),
    enabled: !!token && !!id,
  });
};

// ─── RESERVATION HOOKS ─────────────────────────────────────────

export const useReservationsQuery = (token: string, params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESERVATIONS, params],
    queryFn: () => getReservations(token, params),
    enabled: !!token,
  });
};

export const useSingleReservationQuery = (token: string, id: number | string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_RESERVATION, id],
    queryFn: () => getSingleReservation(token, id),
    enabled: !!token && !!id,
  });
};
