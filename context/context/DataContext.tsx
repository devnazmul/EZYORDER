import React, { createContext, useContext } from "react";

export interface DataContextType {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  refetch: () => Promise<any>;
  isDataLoading: boolean;
  isDataGetSuccess: boolean;
  isDataHasError: boolean;
  settings: any;
  isSettingsLoading: boolean;
  refetchSettings: () => Promise<any>;
  businessTiming: any;
  isBusinessTimingLoading: boolean;
  refetchBusinessTiming: () => Promise<any>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
