---
trigger: always_on
---

# Expo Advanced Standards

## 10. Navigation (Expo Router)

- No navigation inside services — it belongs in screens, components, or navigation hooks.
- Route params stay small and serializable (`/doctor/123`, not a serialized object) — fetch by ID instead.
- **Errors:** use route-level `ErrorBoundary` exports (SDK 56+) rather than manually wrapping every screen in a React error boundary.
  ```tsx
  export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
    return <ErrorScreen message={error.message} onRetry={retry} />;
  }
  ```
- **Loading:** use `SuspenseFallback` (SDK 56+) for route-level fallbacks, TanStack Query's `isPending`/`isLoading` for server-data loading, and feature skeletons for content. Don't collapse all three into one global spinner.
- Follow the Expo SDK version already pinned in `package.json` — don't upgrade opportunistically, and don't mix APIs across SDK generations. (Baseline for this ruleset: SDK 57 / Expo Router ~57.x.)

---

## 11. Animation

`react-native-reanimated` is the standard — use it for gestures, transitions, layout animations, and anything performance-sensitive or UI-thread. RN's built-in `Animated` API is fine for simple cases where Reanimated adds nothing.

**Do not use Framer Motion** — it's a web/DOM library and isn't reliable inside React Native.

Keep worklet/UI-thread code lightweight: no network calls, business logic, or navigation inside worklets.

---

## 12. Performance

- **Memoization:** use `useCallback`/`useMemo` only when identity or cost genuinely matters (passed to a memoized child, a dependency, an expensive computation) — not mechanically on every handler.
- **Lists:** use `FlatList`/`SectionList` for large or unbounded collections, never `.map()` inside a `ScrollView`. Stable keys (not array index, when IDs exist). Extract complex list items into their own components. Don't nest virtualized lists inside a `ScrollView` without a documented reason.
- **Images:** use the project's approved image component (`expo-image` where standardized), appropriately sized sources, placeholders, and caching — don't load full-resolution images for small UI elements.
- Optimize based on measured behavior, not preemptively.

---

## 13. Native Concerns

- **Safe areas:** use `react-native-safe-area-context`, applied once at the screen/layout boundary — not hardcoded padding, not re-applied by every child.
- **Keyboard:** forms must work with the on-screen keyboard on iOS and Android (`KeyboardAvoidingView`/`ScrollView`/approved lib) — no hardcoded offsets.
- **Accessibility:** provide `accessibilityRole`/`Label`/`Hint`/`State` where relevant; icon-only buttons need labels; don't rely on color alone for state; keep touch targets reasonably sized.
- **Platform differences:** isolate iOS/Android-specific code behind a hook/service, not scattered `Platform.OS` checks through unrelated components.

---

## 14. Security

- Never store passwords. Never persist plaintext refresh tokens or private API keys in normal storage — use the project's secure storage (e.g. Expo SecureStore) for sensitive tokens.
- Never log tokens, passwords, or auth headers — not in `console.log`, analytics, crash logs, or URLs.
- Anything in `EXPO_PUBLIC_*` is public by definition — no secrets there. Secrets belong on the backend.
- Centralize auth (Auth Provider/Store → Secure Storage → API Client → refresh logic) rather than managing tokens per-screen.

---

## 17. Code Style

**Comments** explain _why_, not _what_. Avoid decorative section comments on small files; larger files may use:

```tsx
// ==================== IMPORTS / TYPES / CONSTANTS / SUB-COMPONENTS / COMPONENT / HOOKS / HANDLERS / RENDER ====================
```

**Import order:**

```tsx
// 1. React / React Native
// 2. Expo / Navigation
// 3. External libraries
// 4. Shared components
// 5. Feature components/hooks
// 6. Types
// 7. Constants/utils
```

**NativeWind v4:** `bg-linear-*` (not `bg-gradient-*`), `shrink-0` (not `flex-shrink-0`). Don't mix NativeWind versions/syntax.

**Styling priority:** NativeWind → `StyleSheet` for genuinely reusable styles → small inline styles for dynamic values (`style={{ height: animatedHeight }}` is fine; large repeated inline objects aren't).

**Utilities vs. domain logic:** `formatCurrency()` is a utility (`utils/`). `calculateDoctorCommission()` is domain logic (`features/doctor/services/`). Don't hide business rules inside generic utils; if a helper is single-feature, keep it in that feature.

---

## 18. Testing

Business-critical services should be unit-testable without React Native. Prioritize: business calculations, validation, transformations, auth logic, critical flows. Prefer behavior-based tests over implementation-detail tests.

---

## 19. Anti-Patterns

```text
❌ Feature-specific hooks/components in src/hooks or src/components
❌ Direct API calls or business logic in components
❌ Server state duplicated into global stores
❌ Manually duplicated query keys / blanket invalidateQueries() after every mutation
❌ Mandatory optimistic updates; mechanical useCallback/useMemo everywhere
❌ Services importing React or performing navigation
❌ Password storage; plaintext tokens; secrets in EXPO_PUBLIC_*; logging credentials
❌ Large lists via ScrollView + .map(); hardcoded safe-area/keyboard offsets
❌ Huge images for tiny UI elements; business rules hidden in generic utils
❌ Deeply nested ternaries; unnecessary global state or new libraries
❌ Framer Motion as the RN animation default
❌ Mixing Expo SDK versions/APIs
```

---

## 20. AI Coding Assistant Rules

1. Inspect nearby existing code before creating a new abstraction; reuse existing components/hooks/services.
2. Follow the feature folder structure; don't duplicate API clients or query-key factories.
3. Don't introduce a new global store or library without justification.
4. Preserve existing public APIs unless the task requires a breaking change.
5. Prefer composition over new configuration flags. Don't create `BaseComponent`/`GenericComponent` abstractions without a demonstrated reuse need.
6. Keep changes scoped to the requested feature — no unrelated renames, moves, or upgrades unless explicitly asked.
7. Explain architectural changes when they're necessary.

---

## 21. Quick Checklist

- [ ] Feature-specific code is inside `features/<domain>/`; shared code is genuinely shared
- [ ] Components don't call APIs or hold business logic directly
- [ ] Business logic in services, React integration in hooks, TanStack Query owns server state
- [ ] Query keys use factories; mutations invalidate the narrowest correct key
- [ ] Optimistic updates used only where appropriate
- [ ] Composition preferred for structurally configurable components
- [ ] Types are `I`-prefixed and consistent; Zod schemas colocated in `schema/`
- [ ] Forms use `CustomForm`; navigation stays out of services
- [ ] Expo Router `ErrorBoundary`/`SuspenseFallback` match the installed SDK
- [ ] Reanimated used for animation; no Framer Motion
- [ ] `useCallback`/`useMemo` used only when justified
- [ ] Large lists virtualized with stable keys; images appropriately sized
- [ ] Safe areas, keyboard behavior, and accessibility handled correctly
- [ ] No passwords stored; sensitive tokens in secure storage; nothing sensitive logged or in `EXPO_PUBLIC_*`
- [ ] Errors handled at the right layer; loading/empty/error states distinguished
- [ ] No unnecessary libraries introduced; no unrelated refactoring; no duplicated business logic

---

## Final Rule

Prefer simple, explicit, feature-local, composable code over clever abstractions. When uncertain, follow the existing project pattern rather than introducing a new one.
