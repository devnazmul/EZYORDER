import { ALLOWED_ROLES, ROLE } from "@/constants";
import { useAuth } from "@/src/context/AuthContext";
import { Redirect, Stack, usePathname } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { token, user } = useAuth();
  const pathname = usePathname();

  if (token && !pathname.includes("unauthorized")) {
    const userRole = (user?.role?.name || "").toLowerCase().trim() as ROLE;
    const isAllowed = ALLOWED_ROLES.includes(userRole);

    if (!isAllowed) {
      return <Redirect href="/(auth)/unauthorized" />;
    }

    if (userRole === ROLE.DRIVER) {
      return <Redirect href="/(driver)" />;
    }
    if (userRole === ROLE.OWNER) {
      return <Redirect href="/(owner)/home" />;
    }
    return <Redirect href="/(auth)/unauthorized" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="unauthorized" />
    </Stack>
  );
}
