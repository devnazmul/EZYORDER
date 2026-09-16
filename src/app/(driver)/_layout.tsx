import { Text } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AUTH_ROUTES, COLORS, OWNER_ROUTES } from "@/constants";
import { useAuth } from "@/src/context/AuthContext";

interface ITabBarLabelProps {
  title: string;
  color: string;
}

function TabBarLabel({ title, color }: Readonly<ITabBarLabelProps>) {
  return (
    <Text
      style={{
        color,
        fontSize: 10.5,
        fontWeight: "600",
        marginTop: 2,
        textAlign: "center",
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {title}
    </Text>
  );
}

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
    <Tabs
      screenOptions={{
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
      }}
    >
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
