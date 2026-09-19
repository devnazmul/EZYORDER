import { View } from "react-native";

import { Redirect, Stack, usePathname } from "expo-router";

import AppHeader from "@/components/AppHeader";
import { AUTH_ROUTES, DRIVER_ROUTES, OWNER_ROUTES } from "@/constants";
import { useAuth } from "@/src/context/AuthContext";

export default function OwnerLayout() {
  const { token, user } = useAuth();
  const pathname = usePathname();

  if (!token) {
    return <Redirect href={AUTH_ROUTES.LOGIN} />;
  }

  const role = (user?.type || "").toLowerCase().trim();
  if (role === "driver") {
    return <Redirect href={DRIVER_ROUTES.DASHBOARD} />;
  }

  const rootRoutes = [
    OWNER_ROUTES.HOME,
    OWNER_ROUTES.ORDERS,
    OWNER_ROUTES.REPORTS,
    OWNER_ROUTES.NOTIFICATIONS,
    OWNER_ROUTES.MORE,
  ];
  const showBackButton = !rootRoutes.some(
    (route) => pathname === route || pathname === route.replace("/(owner)", ""),
  );

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBackButton={showBackButton} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}
