import LoadingScreen from "@/components/reuseable/LoadingScreen";
import { AuthProvider, DataProvider, ResponsiveProvider } from "@/context";
import { useAuth, usePushNotifications } from "@/hooks";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import "../global.css";

const queryClient = new QueryClient();

function RootNavigation() {
  const { isLoading } = useAuth();

  // Initialize push notification listeners and backend auto-registration
  usePushNotifications();

  if (isLoading) {
    return <LoadingScreen message="Restoring session..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(owner)" />
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ResponsiveProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <DataProvider>
              <BottomSheetModalProvider>
                <StatusBar style="dark" />
                <RootNavigation />
              </BottomSheetModalProvider>
            </DataProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ResponsiveProvider>
    </GestureHandlerRootView>
  );
}
