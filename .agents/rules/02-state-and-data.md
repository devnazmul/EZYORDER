---
trigger: always_on
---

# Expo State & Data Rules

## 7. Server State (TanStack Query)

TanStack Query is the source of truth for server state — don't duplicate it into Zustand/Redux/Context unless there's a specific reason.

- **Domain-Shaped Query Key Factories**: Create and use query key factories for domains (e.g., `menuItemKeys.all`, `menuItemKeys.list()`) to ensure query keys are strictly typed and structured, making targeted invalidation easier.
- **Colocate Hooks by Feature**: Organize query and mutation hooks within a feature folder structure (`src/features/<domain>/apis/`). Do not mix domain hooks in generic global folders.
- **Optimistic Mutations**: Use `onMutate` to snapshot previous query data and apply optimistic updates to the cache (`setQueryData`), providing instant UI feedback. Always rollback `onError` and invalidate related queries `onSettled`.
- **Targeted Invalidation**: Invalidate specific domain-shaped keys (e.g., `queryClient.invalidateQueries(menuItemKeys.lists())`) after mutations instead of doing broad global refetches.

---

## 8. Types & Validation

- Prefer descriptive PascalCase, `I`-prefixed for interfaces/types (matches this project's existing convention): `IUser`, `IUserStatus`, `ILoginFormData` — including Zod-inferred types (`type ILoginFormData = z.infer<typeof loginSchema>`).
- No `any` unless truly unavoidable — prefer `unknown` with type guards.
- Type API responses, mutation variables/context, and query keys (via factories). Don't redefine the same domain type in multiple components.
- Zod schemas live in `features/<domain>/schema/`, named `[name].schema.ts`, exported through that folder's `index.ts`. Use Zod at external/API boundaries — don't assume TS types alone validate runtime data.

---

## 9. Forms

Use `CustomForm` for application forms and the custom inputs in `@/components/form/input/` (e.g. `InputField`) instead of raw `<TextInput>`.

Exception: direct RN inputs are fine when building the input abstraction itself, or for controls that aren't really "a form" — search boxes, OTP entry, filters, inline-edit fields.

---

## 15. Error Handling

```text
API/Network Error → API Client/Service → TanStack Query → Feature Hook → UI
```

- No silent failures or empty `catch` blocks. Normalize API errors in the API layer; convert technical errors to safe user-facing messages — never expose raw backend errors.
- Map backend 422 validation errors into `CustomForm` field errors rather than reimplementing this per form.
- Distinguish loading / success-with-data / success-empty / error / retry — don't show empty state while loading, and don't treat an empty result as an error.
- Auth-dependent routes must distinguish "checking," "authenticated," and "unauthenticated" — don't redirect before auth state finishes initializing.

---

## 16. State Ownership

| State                      | Owner                                 |
| -------------------------- | ------------------------------------- |
| Server state               | TanStack Query                        |
| Form state                 | `CustomForm` / React Hook Form        |
| Local UI state             | `useState` / `useReducer`             |
| Cross-feature client state | Zustand/Context — only when justified |
| Navigation state           | Expo Router                           |

Before adding global state, ask: is it shared across unrelated components, does it need to survive navigation, is it actually server state, could TanStack Query already own it? If TanStack Query can own it, don't duplicate it in Zustand.

**Component State Rule:** If a component contains more than 4 state variables, use `useReducer` instead of `useState`.
