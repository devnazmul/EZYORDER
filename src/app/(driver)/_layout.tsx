import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabBarLabel } from "@/components/reuseable";
import { AUTH_ROUTES, OWNER_ROUTES } from "@/constants";
import { useAuth } from "@/src/context/AuthContext";
import { getTabBarScreenOptions } from "@/utils";

interface ITabConfig {
  name: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const DRIVER_TABS_CONFIG: ITabConfig[] = [
  { name: "index", title: "Dashboard", icon: "dashboard" },
  { name: "my-orders", title: "My Orders", icon: "receipt" },
];

export default function DriverLayout() {
  const { token, user } = useAuth();
  const insets = useSafeAreaInsets();

  if (!token) {
    return <Redirect href={AUTH_ROUTES.LOGIN} />;
  }

  const role = (user?.type || "").toLowerCase().trim();
  if (role !== "driver") {
    return <Redirect href={OWNER_ROUTES.HOME} />;
  }

  return (
    <Tabs screenOptions={getTabBarScreenOptions(insets)}>
      {DRIVER_TABS_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarLabel: ({ color }) => (
              <TabBarLabel title={tab.title} color={color as string} />
            ),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={tab.icon} size={24} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
