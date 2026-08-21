# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Coding Guidelines: API & React Query Hook Architecture

To maintain consistency with the web application reference structure, all data-fetching code in this React Native/Expo project must follow this pattern:

## 1. Directory Structure

1. **APIs**: Standalone Axios request functions must be grouped by category under `apis/` (e.g. `apis/dashboard.ts`, `apis/notification.ts`).
2. **React Query Hooks**: Query wrappers must be created under `hooks/` (e.g. `hooks/useDashboardQueries.ts`, `hooks/useNotificationQueries.ts`).
3. **Domain-Specific Components**: Dashboard widgets must go under `components/dashboard/`, and other domain cards (like `NotificationCard`, `OrderCard`) directly under `components/`.
4. **Reusable Generic Components**: Pure UI components must go under `components/reuseable/`.

---

## 2. API Call Function Guidelines

API files must wrap the Axios calls cleanly, taking the authorization token dynamically:

```typescript
import axios from "axios";
import ENV from "@/config/env";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const getSomeResource = async (token: string, filterVal: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/some-endpoint`, {
    headers: getHeaders(token),
    params: { filter: filterVal },
    validateStatus: () => true, // resolve status internally
  });
  return response.status === 200 && response.data?.success
    ? response.data.data
    : null;
};
```

---

## 3. Custom Query Hooks Guidelines

Wrap the API functions using `@tanstack/react-query`'s `useQuery` or `useMutation`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSomeResource, updateSomeResource } from "@/apis/someResource";

export const useSomeResourceQuery = (token: string, filterVal: string) => {
  return useQuery({
    queryKey: ["someResource", filterVal],
    queryFn: () => getSomeResource(token, filterVal),
    enabled: !!token,
  });
};

export const useUpdateSomeResourceMutation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => updateSomeResource(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["someResource"] });
    },
  });
};
```

---

## 4. Re-mounting conditionally rendered root components (Metro/NativeWind v4)

When conditional states switch (like `isLoading = true` -> `isLoading = false`), NativeWind v4 will trigger dynamic styling upgrade warnings if it tries to reuse the layout view nodes. In React Navigation routers, this warning causes a fatal context crash: `Couldn't find a navigation context`.

- **Rule**: Always provide a unique `key` parameter to the root view containers of conditional blocks:
  - Loading root container: `<View key="loading" ...>`
  - Finished card root container: `<View key="loaded" ...>`
  - Empty state container: `<View key="empty" ...>`

---

## 5. Design & Typography Styling Guidelines

- **Title Text Case**: Always use `capitalize` styling (e.g. Tailwind `capitalize` class) for component titles, section headers, card labels, and section titles across the application. Avoid using `uppercase` or `lowercase` for titles.

---

## 6. Domain-Shaped Query Key Factories

Create and use query key factories for domains (e.g., `menuItemKeys.all`, `menuItemKeys.list()`) to ensure query keys are strictly typed and structured, making targeted invalidation easier.

---

## 7. Colocate Hooks by Feature

Organize query and mutation hooks within a feature folder structure (`src/features/<domain>/api/`). Do not mix domain hooks in generic global folders.

---

## 8. Optimistic Mutations

Use `onMutate` to snapshot previous query data and apply optimistic updates to the cache (`setQueryData`), providing instant UI feedback. Always rollback `onError` and invalidate related queries `onSettled`.

---

## 9. Targeted Invalidation

Invalidate specific domain-shaped keys (e.g., `queryClient.invalidateQueries(menuItemKeys.lists())`) after mutations instead of doing broad global refetches.

---

## 10. Keep Server State out of Global Client State

Use TanStack Query exclusively for server state. Do not sync server data into global stores (like Redux or Zustand) unless absolutely necessary. Rely on the React Query cache.

---

## 11. Component Composition (Prefer Composition over Prop Drilling / Monolithic Components)

Break large components into smaller ones and compose them using `children` or explicit slot props, rather than building one component that takes a pile of config props to control its internals.

- If a component needs more than ~3-4 boolean/variant props just to toggle which children render, switch to composition (`children` or slots) instead.
- Pairs with Rule: the parent owns `filters`/`setFilters` and passes fully-formed children down, rather than every layout component needing to know filter shape.
- Keep composed subcomponents (`CardHeader`, `CardFooter`, etc.) colocated with their parent in the same feature/UI folder unless truly generic, in which case they belong in a shared `components/ui` folder.

---

## 12. Type Safety on Query/Mutation Boundaries

Type `queryFn` return values, `queryKey` tuples, and mutation `variables`/`context` explicitly (no implicit `any`). Infer component prop types from these shared types rather than redefining them ad hoc per component.

---

## 13. Suspense/Error Boundaries at Feature Level

Wrap feature-level data-dependent trees in `<Suspense>` and an error boundary at the feature folder root, not per-component. Avoid scattering loading/error JSX conditionals (`if (isLoading) return ...`) inside every leaf component when the feature already has a boundary.

---

## 14. Stable Callback References

Wrap callbacks passed to memoized children (`React.memo`) in `useCallback`, especially event handlers passed through composed slot props or down through multiple layers. Skip this for callbacks that only exist inline at the leaf and aren't passed further down.

---

## 15. Strictly Use dayjs

Always use `dayjs` for date and time parsing, manipulation, and formatting instead of `moment`. `dayjs` provides a lighter-weight, modern alternative with an almost identical API. Never import or use `momentjs`.

---

## 16. Avoid Unnecessary `useMemo` and `useCallback` (Only Use Where Strictly Required)

- **Do NOT wrap cheap computations**: Primitive operations, $O(1)$ lookups, dictionary access, simple string formatting, simple array filters/reductions on small lists (<100 items), and basic object literals do not need `useMemo`. The hook overhead (memory allocation and dependency comparison) often exceeds the computation cost itself.
- **When `useMemo` IS required**:
  1. Heavy, expensive computations (e.g., complex geometrical/graph layout math, multi-pass transformations on large collections).
  2. Preserving referential identity for objects or arrays passed as dependencies to `useEffect`, `useMemo`, or React Query `queryKey` tuples.
  3. Props passed down to components wrapped in `React.memo` that would otherwise trigger unnecessary re-renders.
- **When `useCallback` IS required**:
  1. Functions passed as props to memoized children (`React.memo`).
  2. Functions listed in dependency arrays of hooks like `useEffect` or custom hooks.
  3. Do NOT wrap handlers that are only used inline at the leaf component level.

---

## 17. Organized Imports via Barrel Files (`index.ts`)

Always create and maintain `index.ts` barrel export files in major architectural folders to keep import paths clean, organized, and decoupled from internal folder restructuring:

- **Global Folders**:
  - `@/components/reuseable`: Reusable generic UI components.
  - `@/utils`: Helper functions, date parsers, formatters, and responsive layout utilities.
  - `@/context`: Global React contexts, state types, and providers.
  - `@/hooks`: Global custom hooks.

- **Feature-Specific Folders**:
  - `features/<domain>/components/index.ts`: Feature domain cards, charts, lists, and corresponding skeletons.
  - `features/<domain>/hooks/queries/index.ts` (or `features/<domain>/api/index.ts`): TanStack Query hooks.

- **Import Cleanliness**:
  - Avoid deep internal relative file path imports from external files (e.g. use `import { formatDate } from "@/utils"` instead of `import { formatDate } from "@/utils/formatDate"`).
  - Consolidate multiple imports from the same directory into a single multiline destructuring statement from the barrel alias (e.g. `import { formatAmount, formatDate } from "@/utils"`).

- **Critical Rules & Circular Dependency Prevention**:
  1. **No Internal Self-Imports**: Files *inside* a folder must NEVER import sibling files via their own `index.ts` (e.g., `utils/formatters.ts` must import `./formatAmount`, NEVER from `@/utils` or `./index`). This causes fatal circular dependencies (`undefined` exports at runtime).
  2. **No Monolithic Mega-Barrels**: Do NOT create a single root barrel (e.g. `src/index.ts`) exporting the whole application. Barrels must remain scoped per directory/domain.
  3. **Strict Type-Only Re-exports**: When re-exporting TypeScript interfaces/types from barrel files, use `type` modifier (e.g., `export { type FilterField } from "./FilterDrawer"`) to enable clean compile-time stripping without runtime evaluation overhead in Metro.

---

## 18. Type and Interface File Organization & Naming (`*.types.ts`)

- **Organization**: Domain- and feature-level TypeScript interfaces and types must be placed in a dedicated `types/` folder within their respective feature directory (e.g., `features/<domain>/types/`).
- **File Naming (`*.types.ts`)**: Type files must explicitly follow the `[name].types.ts` naming convention (e.g., `order.types.ts`, `report.types.ts`). The `index.ts` file within the `types/` folder must be reserved exclusively as a barrel export file.
- **Strict `I` Prefix for Interfaces**: All TypeScript `interface` definitions MUST be prefixed with a capital `I` (e.g., `IUserData`, `IOrderReportFilterValues`, `IOrdersReportParams`). TypeScript `type` aliases do not use the `I` prefix.
- **Type-Only Exports/Imports**: Always use `export type { ... }` and `import type { ... }` (or inline `type` modifiers) to ensure zero runtime overhead during Metro bundling.
