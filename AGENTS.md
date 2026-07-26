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
  return response.status === 200 && response.data?.success ? response.data.data : null;
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

