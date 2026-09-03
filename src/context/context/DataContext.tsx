/**
 * @deprecated
 * ⚠️ GRADUAL MIGRATION NOTICE:
 *
 * This file is a temporary backward-compatibility re-export for legacy components importing from `@/src/context/context/DataContext`.
 * `DataProvider` and `DataContext` have been unmounted and removed from the application root layout (`src/app/_layout.tsx`).
 *
 * GUIDELINES FOR CODERS & PR REVIEWERS:
 * 1. Do NOT import `useData` from `DataContext` in new code or new screens.
 * 2. When refactoring existing screens, replace `useData()` with targeted domain-specific TanStack Query hooks.
 * 3. This file will be completely removed in a future release once all legacy imports are migrated.
 */
export {
  useData,
  type IDataContextData,
  type IDataContextType,
} from "@/hooks/useData";
