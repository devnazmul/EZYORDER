import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import type { EdgeInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants";

type TabsScreenOptions = ComponentProps<typeof Tabs>["screenOptions"];

/**
 * Returns standardized screenOptions for Expo Router tab layouts (`<Tabs screenOptions={...}>`),
 * dynamically accounting for safe-area bottom insets and adhering to theme design tokens.
 *
 * @param insets - Safe area insets from `useSafeAreaInsets()`.
 * @returns Tab bar options configuration object.
 */
export function getTabBarScreenOptions(insets: EdgeInsets): TabsScreenOptions {
  return {
    headerShown: false,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.accent,
    tabBarStyle: {
      height: 60 + (insets.bottom > 0 ? insets.bottom + 8 : 12),
      backgroundColor: COLORS.base300,
      borderTopWidth: 1,
      borderTopColor: "#e2e2e2",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      elevation: 8,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 12,
      paddingTop: 12,
    },
  };
}

export default getTabBarScreenOptions;
