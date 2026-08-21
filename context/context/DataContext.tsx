import {
  IBusinessTimingResponse,
  IDish,
  IMenuItem,
  IRestaurant,
  IVariationItem,
  IVariationType,
} from "@/shared/types";
import React, { createContext, useContext } from "react";

export interface IDataContextData {
  menus?: IMenuItem[];
  dishes?: IDish[];
  variationTypes?: IVariationType[];
  variations?: IVariationItem[];
}

export interface IDataContextType {
  data: IDataContextData;
  setData: React.Dispatch<React.SetStateAction<IDataContextData>>;
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

export const DataContext = createContext<IDataContextType | undefined>(
  undefined,
);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
