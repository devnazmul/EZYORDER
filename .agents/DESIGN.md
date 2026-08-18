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

## Responsive Styling Guidelines

To ensure the user interface scales elegantly across various screen widths and device form factors (including tablets and phones), follow these responsiveness rules:

- **Relative Dimensions over Hardcoded Pixels**: Avoid static values (e.g., `padding: 16`, `width: 200`, `fontSize: 14`) for container bounds, spacings, and layout gaps. Instead, use responsive viewport percentage helper utilities:
  * Use `WP("x%")` for horizontal dimensions like `paddingHorizontal`, `width`, and icon sizes.
  * Use `HP("y%")` for vertical dimensions like `paddingTop`, `paddingBottom`, and vertical layout spacers.
  * Use `getResponsiveFontSize("size")` (where size is `xs`, `sm`, `md`, `lg`, `xl`, etc.) for all text typography to maintain proportional readability across screens.

- **Tailwind Spacing vs. Viewport (HP/WP) Spacing**:
  * **Use Tailwind Spacing Classes** (e.g., `p-2`, `m-1`, `gap-y-2`, `mr-1.5`) for *micro-layouts*: small container elements, margins between closely related labels, layout gaps inside a badge or row item, and minor padding. These compile faster and keep local layout elements clean.
  * **Use HP and WP Viewport Helpers** (e.g., `style={{ paddingHorizontal: WP("4%"), marginVertical: HP("2%") }}`) for *macro-layouts*: page-level screen gutters, primary layout boundaries, outer dimensions of complex cards, major spacers between big sections, and dynamic layout constraints where exact proportional scaling is critical.

- **Responsive Scroll Container Paddings**:
  * Apply horizontal screens gutters using `style={{ paddingHorizontal: WP("4%") }}` or `WP("5%")`.
  * Set list container bottom offsets using `contentContainerStyle={{ paddingBottom: HP("3%") }}` or `HP("5%")` to avoid text cuts at bottom safe areas.

## Color & Branding Guidelines

All components, layouts, charts, and state indicators must strictly conform to the defined brand color system to ensure a premium, unified aesthetic:

- **Strict Brand Color Consumability**: Never use ad-hoc hex values (e.g., `#DC2D2A`, `#FFE4E6`, `#F43F5E`) directly inside UI files. Instead, consume values from the centralized colors configuration:
  * Import `COLORS` from `@/constants/colors`.
  * Use `COLORS.primary` (brand main color), `COLORS.accent` (secondary branding/text), and standard helper keys like `COLORS.success` or `COLORS.warning`.
  
- **Visual Contrast & Opacity Consistency**:
  * Status badges and custom buttons utilizing translucent backgrounds should combine the primary hex value with standard alpha hex codes (e.g., `${COLORS.primary}15` or `${COLORS.primary}20` for a 10%–15% light brand background) or Tailwind transparency classes (`bg-primary/10`, `border-primary/20`) to prevent contrast issues.
  * Skeletons should use standard grey background values (`#E2E8F0` / `bg-slate-200`) configured in a single place to match neutral designs.


