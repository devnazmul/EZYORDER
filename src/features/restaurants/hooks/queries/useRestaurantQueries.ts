import {
  getBusinessTiming,
  getMenuCatalog,
  getRestaurant,
} from "@/features/restaurants/apis/restaurant";
import {
  BUSINESS_TIMING_KEYS,
  MENU_KEYS,
  RESTAURANT_KEYS,
} from "@/constants/queryKeys";
import { useAuth } from "@/src/context/AuthContext";
import {
  IBusinessTimingQueryParams,
  IBusinessTimingResponse,
  IMenuCatalogResponse,
  IMenuQueryParams,
  IRestaurantQueryParams,
  IRestaurantResponse,
} from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Global query hook to fetch complete restaurant menu catalog (menus, dishes, variations).
 */
export const useMenuCatalogQuery = (params?: IMenuQueryParams) => {
  const { token } = useAuth();
  const businessId = params?.business_id;
  const userType = params?.user_type;

  return useQuery<IMenuCatalogResponse | null>({
    queryKey: MENU_KEYS.catalog(params),
    queryFn: () => getMenuCatalog(params),
    enabled:
      !!token &&
      !!businessId &&
      ["restaurant_Owner", "admin", "owner"].includes(userType || ""),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Global query hook to fetch restaurant settings and metadata.
 */
export const useRestaurantQuery = (params?: IRestaurantQueryParams) => {
  const { token } = useAuth();
  const targetId = params?.restaurant_id;

  return useQuery<IRestaurantResponse | null>({
    queryKey: RESTAURANT_KEYS.detail(params),
    queryFn: () => getRestaurant(params),
    enabled: !!token && !!targetId,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

/**
 * Global query hook to fetch restaurant operating business hours.
 */
export const useBusinessTimingQuery = (params?: IBusinessTimingQueryParams) => {
  const { token } = useAuth();
  const targetId = params?.restaurant_id;

  return useQuery<IBusinessTimingResponse | null>({
    queryKey: BUSINESS_TIMING_KEYS.detail(params),
    queryFn: () => getBusinessTiming(params),
    enabled: !!token && !!targetId,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
