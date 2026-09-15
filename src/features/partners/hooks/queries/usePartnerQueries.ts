// 3. External libraries
import { useQuery } from "@tanstack/react-query";

// 4. Shared context & constants
import { PARTNER_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/context/AuthContext";

// 5. Feature APIs
import {
  getDailyOrderPartnerSales,
  getRestaurantPartners,
} from "../../apis/partners";

// 6. Types
import type {
  GetDailyOrderPartnerSalesResponse,
  GetRestaurantPartnersResponse,
  IGetDailyOrderPartnerSalesParams,
  IGetRestaurantPartnersParams,
} from "../../types/partnersAPI.types";

export const useRestaurantPartnersQuery = (
  params: IGetRestaurantPartnersParams,
) => {
  const { token } = useAuth();
  return useQuery<GetRestaurantPartnersResponse>({
    queryKey: PARTNER_KEYS.list(params),
    queryFn: () => getRestaurantPartners(params),
    enabled: !!token && !!params.restaurant_id,
  });
};

export const useDailyOrderPartnerSalesQuery = (
  params: IGetDailyOrderPartnerSalesParams,
) => {
  const { token } = useAuth();
  return useQuery<GetDailyOrderPartnerSalesResponse>({
    queryKey: PARTNER_KEYS.saleList(params),
    queryFn: () => getDailyOrderPartnerSales(params),
    enabled: !!token && !!params.restaurant_id,
  });
};
