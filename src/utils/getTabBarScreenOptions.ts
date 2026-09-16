import type { ComponentProps } from "react";
import type { Tabs } from "expo-router";
import type { EdgeInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants";

type TabsScreenOptions = ComponentProps<typeof Tabs>["screenOptions"];

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
