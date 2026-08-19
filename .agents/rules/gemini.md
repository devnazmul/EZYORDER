---
trigger: always_on
---

1. **Domain-Shaped Query Key Factories**: Create and use query key factories for domains (e.g., `menuItemKeys.all`, `menuItemKeys.list()`) to ensure query keys are strictly typed and structured, making targeted invalidation easier.

2. **Colocate Hooks by Feature*: Organize query and mutation hooks within a feature folder structure (src/features/<domain>/api/). Do not mix domain hooks in generic global folders.

3. **Optimistic Mutations**: Use `onMutate` to snapshot previous query data and apply optimistic updates to the cache (`setQueryData`), providing instant UI feedback. Always rollback `onError` and invalidate related queries `onSettled`.

4. **Targeted Invalidation**: Invalidate specific domain-shaped keys (e.g., `queryClient.invalidateQueries(menuItemKeys.lists())`) after mutations instead of doing broad global refetches.

5. **Keep Server State out of Global Client State**: Use TanStack Query exclusively for server state. Do not sync server data into global stores (like Redux or Zustand) unless absolutely necessary. Rely on the React Query cache.

6. **Component Composition (Prefer Composition over Prop Drilling / Monolithic Components)**: Break large components into smaller ones and compose them using `children` or explicit slot props, rather than building one component that takes a pile of config props to control its internals.
    - If a component needs more than ~3-4 boolean/variant props just to toggle which children render, switch to composition (`children` or slots) instead.
    - Pairs with Rule #6: the parent owns `filters`/`setFilters` and passes fully-formed children down, rather than every layout component needing to know filter shape.
    - Keep composed subcomponents (`CardHeader`, `CardFooter`, etc.) colocated with their parent in the same feature/UI folder unless truly generic, in which case they belong in a shared `components/ui` folder (mirrors Rule #8).

7. **Type Safety on Query/Mutation Boundaries**: Type `queryFn` return values, `queryKey` tuples, and mutation `variables`/`context` explicitly (no implicit `any`). Infer component prop types from these shared types rather than redefining them ad hoc per component.

8. **Loading/Error States via Expo Router**: Prefer using Expo Router's built-in `_layout.tsx` (or `loading.tsx` and `error.tsx`) boundaries for feature-level suspense and error catching, rather than manually wrapping components in `<Suspense>` and `<ErrorBoundary>` unless absolutely necessary.

9. **Stable Callback References**: Wrap callbacks passed to memoized children (`React.memo`) in `useCallback`, especially event handlers passed through composed slot props (Rule #12) or down through multiple layers (Rule #6). Skip this for callbacks that only exist inline at the leaf and aren't passed further down.

10. **Strictly Use dayjs**: Always use `dayjs` for date and time parsing, manipulation, and formatting. `dayjs` provides a lighter-weight, modern alternative with an almost identical API.

11. **Conditional Rendering in NativeWind v4**: Always provide a unique `key` parameter to the root view containers of conditional blocks (`key="loading"`, `key="loaded"`, `key="empty"`) to prevent navigation context crashes when states switch.

12. **Zod Schema Organization and Naming Conventions**: All Zod validation schemas must be placed inside a designated `schema/` directory within their respective feature or domain folder. Schema files must follow the naming convention `[name].schema.ts` (e.g., `user.schema.ts`, `login.schema.ts`). Additionally, all schemas within a `schema/` folder must be exported from an `index.ts` file (barrel file) within that same folder to simplify and organize imports elsewhere in the application.

13. **Interface and Type Naming**: All TypeScript `interface` and `type` definitions MUST be prefixed with a capital `I` (e.g., `IUserData`, `ILoginFormData`).

14. **Strictly Use CustomForm**: Always use the `CustomForm` component (`@/components/form/CustomForm.tsx`) for all form implementations instead of standalone `react-hook-form` setups. `CustomForm` provides centralized form state management, `zod` validation integration, built-in loading/submitting states, and automatic 422 server validation error mapping to form fields.

15. **Strictly Use Custom Form Input Components**: Always use the custom form input components available in `@/components/form/input/` instead of standard React Native `<TextInput>` or other generic inputs. These custom components (e.g., `InputField`) offer standardized error rendering, integration with `react-hook-form`, and consistent UI styling across the application. Use these in conjunction with `CustomForm`.