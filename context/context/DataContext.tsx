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

/**
 * @deprecated
 * DEPRECATED: This DataContext duplicates server state into a global React Context.
 * This causes excessive root-level re-renders and violates Rule #5
 * ("Keep Server State out of Global Client State").
 *
 * NOTE FOR REVIEWERS & DEVELOPERS:
 * This context is kept temporarily to avoid breaking legacy screens during the active TanStack Query
 * migration. Do NOT use `useData()` in new screens or features. Instead, consume domain-specific
 * TanStack Query hooks directly (e.g. `useRestaurantQuery`, `useCombineDataQuery`, `useBusinessTimingQuery`).
 *
 * FIXME: Migrate all remaining legacy consumers of `useData()` to targeted TanStack Query hooks
 * and remove `DataProvider` and `DataContext` on an urgent basis.
 */
export const DataContext = createContext<IDataContextType | undefined>(
  undefined,
);

/**
 * @deprecated
 * DEPRECATED: `useData` consumes global duplicated server state.
 * Use domain-specific TanStack Query hooks directly instead.
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
