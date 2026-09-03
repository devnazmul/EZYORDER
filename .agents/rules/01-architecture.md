---
trigger: always_on
---

# Expo Architecture Rules

## Purpose
Defines architecture, coding standards, and conventions for this project — for both developers and AI coding assistants.

When modifying existing code:
1. Follow the existing architecture before introducing new patterns.
2. Reuse existing abstractions before creating new ones.
3. Don't introduce a new library when the project already has an approved solution.
4. Don't move code between architectural layers without a clear reason.
5. Prefer small, composable changes over large rewrites.
6. Preserve existing behavior unless the change explicitly requires new behavior.

---

## 1. Tech Stack

React Native · Expo · Expo Router · TypeScript · TanStack Query · Zod · React Hook Form (via `CustomForm`) · NativeWind v4 · `react-native-reanimated` · `dayjs`

Don't introduce an alternative library for a responsibility this stack already covers (e.g. another date lib instead of `dayjs`, another server-state lib instead of TanStack Query, another animation lib instead of Reanimated) without explicit approval.

---

## 2. Folder Structure

```text
src/
├── features/
│   ├── domain1/
│   │   ├── apis/
│   │   │   └── useDomain1Queries.ts    # TanStack Query and mutation hooks
│   │   ├── services/
│   │   │   ├── domain1Service.ts      # pure business logic
│   │   │   └── domain1Validation.ts
│   │   ├── state/
│   │   │   └── domain1.reducer.ts      # pure reducer + action/state types (no React)
│   │   ├── hooks/
│   │   │   └── useDomain1.ts            # calls useReducer(domain1Reducer, ...), React integration layer
│   │   ├── components/
│   │   │   └── ...                       # UI only
│   │   ├── schema/
│   │   │   ├── domain1.schema.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── domain1.types.ts
│   │   └── index.ts                     # public exports (barrel)
│   └── ...
│
├── components/   # truly shared UI only
├── hooks/          # truly shared hooks only
├── utils/            # generic pure utilities only
├── types/              # truly shared/global types
└── assets/
```

**Global folder rule:** feature-specific code stays inside its feature. `src/hooks/`, `src/components/`, etc. are only for code genuinely shared across _unrelated_ features — not just because something is used twice.

**Public API:** each feature exposes its surface through `index.ts`. Everything should be exported from `index.ts` to maintain clean imports. Prefer `import { useDoctor } from "@/features/doctor"` over reaching into internal files.

**New feature starter:**

```text
features/<domain>/
├── apis/
├── components/
├── hooks/
├── services/
├── state/
├── schema/
├── types/
└── index.ts
```

Add files only when needed — don't pre-create empty folders.

---

## 3. Dependency Direction

```text
Components → Feature Hooks → Services / TanStack Query → API Client → Backend
```

- Components may use hooks. Hooks may use services and TanStack Query. Services may use the API client.
- Services must NOT import React/React Native, use hooks, perform navigation, or touch component state.
- Components must NOT call the API client directly or contain domain/business logic.

**Deciding where new code goes:**

| Question                                       | Goes in           |
| ---------------------------------------------- | ----------------- |
| Renders UI?                                    | `components/`     |
| TanStack queries and mutations?                | `apis/`           |
| Integrates React state/effects?                | `hooks/`          |
| Reusable domain/business logic?                | `services/`       |
| Validates runtime data?                        | `schema/`         |
| Domain-specific type?                          | `types/`          |
| Generic, platform-independent helper?          | `src/utils/`      |
| Truly reused across unrelated features?        | `src/components/` |

---

## 4. Services

Platform-independent business logic: calculations, validation, transformations, domain rules, state machines. Should be usable without React Native. Prefer pure functions; use a class only when it adds real organization.

```tsx
export class CartService {
  static calculateTotal(items: ICartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  static validateCart(items: ICartItem[]): IValidationResult {
    if (items.length === 0) return { valid: false, error: "Cart is empty" };
    return { valid: true };
  }
}
```

---

## 5. Hooks

The React integration layer: TanStack Query/mutations, React state, effects, event orchestration, calling services. Keep domain logic out — move it to services.

```tsx
export function useCart() {
  const checkoutMutation = useMutation({
    mutationFn: async (items: ICartItem[]) => {
      const validation = CartService.validateCart(items);
      if (!validation.valid) throw new Error(validation.error);
      const total = CartService.calculateTotal(items);
      return checkoutApi({ items, total });
    },
  });

  return {
    checkout: checkoutMutation.mutateAsync,
    isProcessing: checkoutMutation.isPending,
  };
}
```

Query/mutation hooks belong in `features/<domain>/apis/` — no generic global API-hooks folder.

---

## 6. Components

Render UI, handle interaction, own local UI state, call hooks. No API calls, persistence, or domain calculations.

Presentation logic is fine — `const isDisabled = !email || isSubmitting` is not business logic. `calculateComplexInsurancePremium(...)` is, and belongs in a service.

**Composition over configuration:** when many boolean/variant props determine a component's internal structure, prefer `children`/slots over a growing prop list.

```tsx
<DataScreen>
  <DataScreen.Header>
    <Search />
    <Filters />
  </DataScreen.Header>
  <DataScreen.Content>
    <DoctorList />
  </DataScreen.Content>
  <DataScreen.Footer>
    <Pagination />
  </DataScreen.Footer>
</DataScreen>
```

The parent owns feature-specific state (e.g. filters); layout components shouldn't need to understand its shape. A handful of simple boolean props (`<Button disabled loading variant="primary" />`) is fine — the problem is a component becoming a configurable framework, not prop count itself.

**Sub-components:** small, single-use presentational helpers can stay in the same file, above the main component. Move to their own file when reused, independently complex, ~30–40+ lines, or a meaningful domain/UI concept on its own. Don't split files just to hit a line-count target.
