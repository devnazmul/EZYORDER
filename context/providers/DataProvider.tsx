import {
  useBusinessTimingQuery,
  useCombineDataQuery,
  useRestaurantQuery,
} from "@/features/owner/more/hooks/queries/useRestaurantQueries";
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { DataContext } from "../context/DataContext";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();
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
  } = useCombineDataQuery(token || "", targetId, userType);

  // Fetch restaurant settings
  const {
    data: settings,
    isLoading: isSettingsLoading,
    refetch: refetchSettings,
  } = useRestaurantQuery(token || "", targetId);

  // Fetch business timing
  const {
    data: businessTiming,
    isLoading: isBusinessTimingLoading,
    refetch: refetchBusinessTiming,
  } = useBusinessTimingQuery(token || "", targetId);

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
  const handleRefetch = async () => {
    return refetch();
  };

  const handleRefetchSettings = async () => {
    return refetchSettings();
  };

  const handleRefetchBusinessTiming = async () => {
    return refetchBusinessTiming();
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
