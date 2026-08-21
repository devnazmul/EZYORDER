import {
  useAuth,
  useBusinessTimingQuery,
  useMenuCatalogQuery,
  useRestaurantQuery,
} from "@/hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataContext, IDataContextData } from "../context/DataContext";

/**
 * @deprecated
 * DEPRECATED: This DataProvider wraps TanStack Query hooks and duplicates server state into a global
 * React Context / useState. This causes excessive root-level re-renders and violates Rule #10
 * ("Keep Server State out of Global Client State").
 *
 * NOTE FOR REVIEWERS & DEVELOPERS:
 * This provider is kept temporarily to avoid breaking legacy screens during the active TanStack Query
 * migration. Do NOT use `useData()` in new screens or features. Instead, consume domain-specific
 * TanStack Query hooks directly (e.g. `useRestaurantQuery`, `useCombineDataQuery`, `useBusinessTimingQuery`).
 *
 * FIXME: Migrate all remaining legacy consumers of `useData()` to targeted TanStack Query hooks
 * and remove `DataProvider` and `DataContext` on an urgent basis.
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<IDataContextData>({});

  const targetId = user?.business_id || user?.restaurant?.[0]?.id || null;
  const userType = user?.type;

  // Fetch combined data
  const {
    data: comBineData,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useMenuCatalogQuery({ business_id: targetId, user_type: userType });

  // Fetch restaurant settings
  const {
    data: settings,
    isLoading: isSettingsLoading,
    refetch: refetchSettings,
  } = useRestaurantQuery({ restaurant_id: targetId });

  // Fetch business timing
  const {
    data: businessTiming,
    isLoading: isBusinessTimingLoading,
    refetch: refetchBusinessTiming,
  } = useBusinessTimingQuery({ restaurant_id: targetId });

  useEffect(() => {
    if (isError) {
      console.error("DataProvider: Error fetching combined data:", error);
    } else if (isSuccess && comBineData) {
      setData({
        menus: comBineData?.menu,
        dishes: comBineData?.dishes,
        variationTypes: comBineData?.variation_types,
        variations: comBineData?.variations,
      });
    }
  }, [isLoading, isError, isSuccess, comBineData, error]);

  // Cast refetches to return any to satisfy type definition cleanly
  const handleRefetch = useCallback(async () => {
    return refetch();
  }, [refetch]);

  const handleRefetchSettings = useCallback(async () => {
    return refetchSettings();
  }, [refetchSettings]);

  const handleRefetchBusinessTiming = useCallback(async () => {
    return refetchBusinessTiming();
  }, [refetchBusinessTiming]);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
      data,
      handleRefetch,
      isLoading,
      isSuccess,
      isError,
      settings?.restaurant,
      isSettingsLoading,
      handleRefetchSettings,
      businessTiming,
      isBusinessTimingLoading,
      handleRefetchBusinessTiming,
    ],
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
