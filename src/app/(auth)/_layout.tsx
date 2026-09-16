import { Redirect, Stack, usePathname } from "expo-router";

import {
  ALLOWED_ROLES,
  AUTH_ROUTES,
  DRIVER_ROUTES,
  OWNER_ROUTES,
  ROLE,
} from "@/constants";
import { useAuth } from "@/src/context/AuthContext";

export default function AuthLayout() {
  const { token, user } = useAuth();
  const pathname = usePathname();

  if (token && !pathname.includes("unauthorized")) {
    const userRole = (user?.role?.name || "").toLowerCase().trim() as ROLE;
    const isAllowed = ALLOWED_ROLES.includes(userRole);

    if (!isAllowed) {
      return <Redirect href={AUTH_ROUTES.UNAUTHORIZED} />;
    }

    if (userRole === ROLE.DRIVER) {
      return <Redirect href={DRIVER_ROUTES.DASHBOARD} />;
    }
    if (userRole === ROLE.OWNER) {
      return <Redirect href={OWNER_ROUTES.HOME} />;
    }
    return <Redirect href={AUTH_ROUTES.UNAUTHORIZED} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="unauthorized" />
    </Stack>
  );
}
