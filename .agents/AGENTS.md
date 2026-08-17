1. **Domain-Shaped Query Key Factories**: Create and use query key factories for domains (e.g., `menuItemKeys.all`, `menuItemKeys.list()`) to ensure query keys are strictly typed and structured, making targeted invalidation easier.

2. **Colocate Hooks by Feature**: Organize query and mutation hooks within a feature folder structure (`src/features/<domain>/api/`). Do not mix domain hooks in generic global folders.

3. **Optimistic Mutations**: Use `onMutate` to snapshot previous query data and apply optimistic updates to the cache (`setQueryData`), providing instant UI feedback. Always rollback `onError` and invalidate related queries `onSettled`.

4. **Targeted Invalidation**: Invalidate specific domain-shaped keys (e.g., `queryClient.invalidateQueries(menuItemKeys.lists())`) after mutations instead of doing broad global refetches.

5. **Keep Server State out of Global Client State**: Use TanStack Query exclusively for server state. Do not sync server data into global stores (like Redux or Zustand) unless absolutely necessary. Rely on the React Query cache.

6. **Component Composition (Prefer Composition over Prop Drilling / Monolithic Components)**: Break large components into smaller ones and compose them using `children` or explicit slot props, rather than building one component that takes a pile of config props to control its internals.
   - If a component needs more than ~3-4 boolean/variant props just to toggle which children render, switch to composition (`children` or slots) instead.
   - Pairs with Rule: the parent owns `filters`/`setFilters` and passes fully-formed children down, rather than every layout component needing to know filter shape.
   - Keep composed subcomponents (`CardHeader`, `CardFooter`, etc.) colocated with their parent in the same feature/UI folder unless truly generic, in which case they belong in a shared `components/ui` folder.

7. **Type Safety on Query/Mutation Boundaries**: Type `queryFn` return values, `queryKey` tuples, and mutation `variables`/`context` explicitly (no implicit `any`). Infer component prop types from these shared types rather than redefining them ad hoc per component.

8. **Suspense/Error Boundaries at Feature Level**: Wrap feature-level data-dependent trees in `<Suspense>` and an error boundary at the feature folder root, not per-component. Avoid scattering loading/error JSX conditionals (`if (isLoading) return ...`) inside every leaf component when the feature already has a boundary.

9. **Stable Callback References**: Wrap callbacks passed to memoized children (`React.memo`) in `useCallback`, especially event handlers passed through composed slot props or down through multiple layers. Skip this for callbacks that only exist inline at the leaf and aren't passed further down.

10. **Strictly Use dayjs**: Always use `dayjs` for date and time parsing, manipulation, and formatting instead of `moment`. `dayjs` provides a lighter-weight, modern alternative with an almost identical API. Never import or use `momentjs`.
