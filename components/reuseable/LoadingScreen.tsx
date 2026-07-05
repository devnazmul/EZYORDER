import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoadingScreenProps {
  message?: string;
  useSafeArea?: boolean;
}

export default function LoadingScreen({
  message = "Loading...",
  useSafeArea = true,
}: LoadingScreenProps) {
  const content = (
    <View className="flex-1 items-center justify-center bg-base-100">
      <ActivityIndicator size="large" color="#DC2D2A" />
      {message && (
        <Text className="mt-4 text-xs font-semibold text-accent">{message}</Text>
      )}
    </View>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView className="flex-1 bg-base-100" edges={["top", "bottom"]}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
}
