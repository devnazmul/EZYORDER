// 1. React / React Native & TanStack Query
import { useQuery } from "@tanstack/react-query";

// 2. Navigation / Context
import { useAuth } from "@/src/context/AuthContext";

// 5. Feature API & Types
import { getReservations } from "../../apis/reservations";
import type { IGetReservationsQueryParams } from "../../types/reservationApi.types";

// 7. Constants
import { RESERVATION_KEYS } from "@/constants/queryKeys";

// ==================== RESERVATION HOOKS ====================

export const useReservationsQuery = (
  params: IGetReservationsQueryParams = {},
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: RESERVATION_KEYS.list(params),
    queryFn: () => getReservations(params),
    enabled: !!token,
  });
};
