import { Redirect, Stack, usePathname } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { getRoleRedirectRoute } from "@/utils";

export default function AuthLayout() {
  const { token, user } = useAuth();
  const pathname = usePathname();

  if (token && !pathname.includes("unauthorized")) {
    return <Redirect href={getRoleRedirectRoute(user?.role?.name || "")} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="unauthorized" />
    </Stack>
  );
}
