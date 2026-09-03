import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks";
import {
  BUSINESS_TIMING_KEYS,
  MENU_KEYS,
  RESTAURANT_KEYS,
} from "@/constants/queryKeys";
import {
  useBusinessTimingQuery,
  useMenuCatalogQuery,
  useRestaurantQuery,
} from "@/features/restaurants/hooks/queries/useRestaurantQueries";
import {
  IBusinessTimingResponse,
  IDish,
  IMenuItem,
  IRestaurant,
  IVariationItem,
  IVariationType,
} from "@/types";

export interface IDataContextData {
  menus?: IMenuItem[];
  dishes?: IDish[];
  variationTypes?: IVariationType[];
  variations?: IVariationItem[];
}

export interface IDataContextType {
  data: IDataContextData;
  setData: (data: React.SetStateAction<IDataContextData>) => void;
  refetch: () => Promise<unknown>;
  isDataLoading: boolean;
  isDataGetSuccess: boolean;
  isDataHasError: boolean;
  settings?: IRestaurant;
  isSettingsLoading: boolean;
  refetchSettings: () => Promise<unknown>;
  businessTiming?: IBusinessTimingResponse | null;
  isBusinessTimingLoading: boolean;
  refetchBusinessTiming: () => Promise<unknown>;
}

/**
 * @deprecated
 * ⚠️ GRADUAL MIGRATION NOTICE:
 *
 * `useData` is a temporary backward-compatibility hook maintained during our active TanStack Query migration.
 * It directly delegates to domain-specific TanStack Query hooks (`useRestaurantQuery`, `useMenuCatalogQuery`, `useBusinessTimingQuery`)
 * without global React Context or state duplication.
 *
 * GUIDELINES FOR FUTURE:
 * 1. Do NOT use `useData()` in new screens or features.
 * 2. In existing components, gradually replace `useData()` with targeted domain hooks
 *    (e.g., `useRestaurantQuery({ restaurant_id })` or feature-specific hooks).
 * 3. Once all legacy consumers are migrated, this file (`useData.ts`), `DataContext.tsx`, and `DataProvider.tsx`
 *    will be completely removed in a future release.
 */
export const useData = (): IDataContextType => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const targetId = user?.business_id || user?.restaurant?.[0]?.id || null;
  const userType = user?.type;

  // Fetch combined data
  const {
    data: comBineData,
    isLoading,
    isError,
    isSuccess,
  } = useMenuCatalogQuery({ business_id: targetId, user_type: userType });

  // Fetch restaurant settings
  const { data: settings, isLoading: isSettingsLoading } = useRestaurantQuery({
    restaurant_id: targetId,
  });

  // Fetch business timing
  const { data: businessTiming, isLoading: isBusinessTimingLoading } =
    useBusinessTimingQuery({ restaurant_id: targetId });

  const data: IDataContextData = {
    menus: comBineData?.menu,
    dishes: comBineData?.dishes,
    variationTypes: comBineData?.variation_types,
    variations: comBineData?.variations,
  };

  const setData = () => {
    // No-op for backward compatibility
  };

  const handleRefetch = async () => {
    return queryClient.invalidateQueries({
      queryKey: MENU_KEYS.catalog({
        business_id: targetId,
        user_type: userType,
      }),
    });
  };

  const handleRefetchSettings = async () => {
    return queryClient.invalidateQueries({
      queryKey: RESTAURANT_KEYS.detail({ restaurant_id: targetId }),
    });
  };

  const handleRefetchBusinessTiming = async () => {
    return queryClient.invalidateQueries({
      queryKey: BUSINESS_TIMING_KEYS.detail({ restaurant_id: targetId }),
    });
  };

  return {
    data,
    setData,
    refetch: handleRefetch,
    isDataLoading: isLoading,
    isDataGetSuccess: isSuccess,
    isDataHasError: isError,
    settings: settings?.restaurant,
    isSettingsLoading,
    refetchSettings: handleRefetchSettings,
    businessTiming,
    isBusinessTimingLoading,
    refetchBusinessTiming: handleRefetchBusinessTiming,
  };
};
