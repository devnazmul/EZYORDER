import {
  useBusinessTimingQuery,
  useCombineDataQuery,
  useRestaurantQuery,
} from "@/features/owner/more/hooks/queries/useRestaurantQueries";
import { useAuth } from "@/hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataContext } from "../context/DataContext";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>({});

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
  } = useCombineDataQuery(targetId, userType);

  // Fetch restaurant settings
  const {
    data: settings,
    isLoading: isSettingsLoading,
    refetch: refetchSettings,
  } = useRestaurantQuery(targetId);

  // Fetch business timing
  const {
    data: businessTiming,
    isLoading: isBusinessTimingLoading,
    refetch: refetchBusinessTiming,
  } = useBusinessTimingQuery(targetId);

  useEffect(() => {
    if (isError) {
      console.error("DataProvider: Error fetching combined data:", error);
    } else if (isSuccess && comBineData) {
      setData({
        menus: comBineData?.menu || comBineData?.menus,
        dishes: comBineData?.dishes,
        variationTypes:
          comBineData?.variation_types || comBineData?.variationTypes,
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
