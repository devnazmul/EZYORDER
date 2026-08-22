import { useContext } from "react";
import { DataContext } from "@/context/context/DataContext";

/**
 * @deprecated
 * DEPRECATED: `useData` consumes global duplicated server state from DataContext / DataProvider.
 * This causes excessive root-level re-renders and violates Rule #5
 * ("Keep Server State out of Global Client State").
 *
 * NOTE FOR REVIEWERS & DEVELOPERS:
 * This hook is kept temporarily to avoid breaking legacy screens during the active TanStack Query
 * migration. Do NOT use `useData()` in new screens or features. Instead, consume domain-specific
 * TanStack Query hooks directly (e.g. `useRestaurantQuery`, `useCombineDataQuery`, `useBusinessTimingQuery`).
 *
 * FIXME: Migrate all remaining legacy consumers of `useData()` to targeted TanStack Query hooks
 * and remove `DataProvider`, `DataContext`, and `useData()` on an urgent basis.
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
