import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function AuthLayout() {
  const { token, user } = useAuth();

  if (token) {
    const role = (user?.type || "").toLowerCase().trim();
    if (role === "driver") {
      return <Redirect href="/(driver)" />;
    }
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
