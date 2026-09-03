import {
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
  useFonts,
} from "@expo-google-fonts/roboto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import LoadingScreen from "@/components/reuseable/LoadingScreen";
import { useAuth, usePushNotifications } from "@/hooks";
import { AuthProvider, ResponsiveProvider } from "@/src/context";

import "../styles/global.css";

// Prevent splash screen from hiding automatically until assets are loaded
SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded, fontError] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#FFFFFF");
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ResponsiveProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BottomSheetModalProvider>
              <StatusBar style="dark" />
              <RootNavigation />
            </BottomSheetModalProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ResponsiveProvider>
    </GestureHandlerRootView>
  );
}
