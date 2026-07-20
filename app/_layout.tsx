import LoadingScreen from "@/components/reuseable/LoadingScreen";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/providers/DataProvider";
import { allowedUserTypes, checkUserType } from "@/features/auth";
import { usePushNotifications } from "@/hooks/usePushNotifications";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

import "../global.css";

const queryClient = new QueryClient();

function RootNavigation() {
  const { token, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Initialize push notification listeners and backend auto-registration
  usePushNotifications();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!token) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else {
      if (inAuthGroup) {
        if (checkUserType(user, allowedUserTypes)) {
          const userType = (user?.type || "").toLowerCase().trim();
          if (userType === "driver") {
            router.replace("/(driver)");
          } else {
            router.replace("/(tabs)/home");
          }
        }
      }
    }
  }, [token, isLoading, segments, user]);

  if (isLoading) {
    return <LoadingScreen message="Restoring session..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(driver)" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#FFFFFF");
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <StatusBar style="dark" />
          <RootNavigation />
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
