# Skeleton Loader Design Theme & Guidelines

Skeleton loaders must follow these design themes and guidelines to ensure unified presentation across the application:

- **Layout Mirroring**: Skeletons must mirror the exact layout hierarchy, column sizes, padding, borders, and margins of the corresponding loaded components. This prevents layout shifting (Cumulative Layout Shift) when transitioning from a loading state to a hydrated state.
- **Pulsing Animation**: Always wrap the skeleton elements in an `Animated.View` utilizing a gentle pulsing opacity loop (typically oscillating between `0.4` and `1.0` or `0.3` and `1.0` over `700ms` to `900ms`) to indicate an active process.
- **Color Theme**: Placeholder shapes (texts, badges, circles, buttons) should use neutral, subtle slate tones (specifically `bg-slate-200` directly for standard bones across both light and dark modes, avoiding dark variants like `dark:bg-slate-800` or `bg-slate-800` since they render too dark on container backgrounds).
- **Visual Coherence**: The background, borders, and pulse rates of card skeleton loaders must match the design theme of other general skeletons and loaders on the same view (e.g., matching card skeletons to surrounding KPI card loaders) to ensure unified loading states.
- **NativeWind Component Styling**: Always use standard, primitive React Native components (e.g., `<View className="bg-slate-200 rounded h-3 w-16" />`) directly instead of passing classNames through custom helper components (like `<Bone className="..." />`). Because NativeWind is a build-time compiler, passing style strings as props to custom components skips compile-time style generation, rendering skeleton elements invisible with 0 height and width.

## Casing & Text Presentation Guidelines

- **Capitalized Casing Only**: To maintain a modern, friendly, and consistent aesthetic, always prefer capitalized font styling (sentence case, title case, or `capitalize` styling) over fully uppercase casing. Avoid using `uppercase` style utilities (like `uppercase` in Tailwind/NativeWind) or fully upper-cased string literals for status labels, headers, buttons, or descriptors.

## Styling & Render Guidelines (React Native / NativeWind)

- **Semi-Transparent Backgrounds and Shadows Bleed-Through**: When applying a semi-transparent background (e.g., `bg-rose-50/40` or an RGBA color) to a component that also contains a shadow (such as Tailwind's `shadow-sm` or Android's `elevation`), the layout engine renders the shadow directly behind the component. Because the background is transparent or translucent, the dark/grayish shadow shape bleeds through the center of the component, making the inner area look muddy or solidly filled with a dark tint instead of being clean and transparent. To fix this, explicitly remove the shadow properties using `!shadow-none` (or `!elevation-0` on Android) when using translucent/semi-transparent background colors:
  ```tsx
  <Button
    label="Failed Delivery"
    containerClassName="!border-rose-100 !bg-rose-50/40 !shadow-none"
    buttonClassName="!text-rose-700"
  />
  ```

- **Re-mounting Conditionally Rendered Root Components (NativeWind v4)**: When conditional states switch (e.g. `isLoading` transitioning from `true` to `false`), React Native layouts can trigger styling warning logs if NativeWind tries to reuse the layout view nodes. Always provide a unique `key` parameter to the root view containers of conditional blocks:
  - Loading root container: `<View key="loading" ...>`
  - Loaded card root container: `<View key="loaded" ...>`
  - Empty state container: `<View key="empty" ...>`


