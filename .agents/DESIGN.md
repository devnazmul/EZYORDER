# Skeleton Loader Design Theme & Guidelines

Skeleton loaders must follow these design themes and guidelines to ensure unified presentation across the application:

- **Layout Mirroring**: Skeletons must mirror the exact layout hierarchy, column sizes, padding, borders, and margins of the corresponding loaded components. This prevents layout shifting (Cumulative Layout Shift) when transitioning from a loading state to a hydrated state.
- **Pulsing Animation**: Always wrap the skeleton elements in an `Animated.View` utilizing a gentle pulsing opacity loop (typically oscillating between `0.4` and `1.0` or `0.3` and `1.0` over `700ms` to `900ms`) to indicate an active process.
- **Color Theme**: Placeholder shapes (texts, badges, circles, buttons) should use neutral, subtle slate tones (specifically `bg-slate-200` directly for standard bones across both light and dark modes, avoiding dark variants like `dark:bg-slate-800` or `bg-slate-800` since they render too dark on container backgrounds).
- **Visual Coherence**: The background, borders, and pulse rates of card skeleton loaders must match the design theme of other general skeletons and loaders on the same view (e.g., matching card skeletons to surrounding KPI card loaders) to ensure unified loading states.
- **NativeWind Component Styling**: Always use standard, primitive React Native components (e.g., `<View className="bg-slate-200 rounded h-3 w-16" />`) directly instead of passing classNames through custom helper components (like `<Bone className="..." />`). Because NativeWind is a build-time compiler, passing style strings as props to custom components skips compile-time style generation, rendering skeleton elements invisible with 0 height and width.

## Casing & Text Presentation Guidelines

- **Capitalized Casing Only**: To maintain a modern, friendly, and consistent aesthetic, always prefer capitalized font styling (sentence case, title case, or `capitalize` styling) over fully uppercase casing. Avoid using `uppercase` style utilities (like `uppercase` in Tailwind/NativeWind) or fully upper-cased string literals for status labels, headers, buttons, or descriptors.

