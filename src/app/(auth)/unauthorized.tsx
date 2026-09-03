// 1. React / React Native
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";

// 4. Shared components & context
import { CustomText, ScreenContainer } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { WP } from "@/utils/getResponsiveSizes";

export default function UnauthorizedScreen() {
  const { logout, user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      logout();
    }
  }, [secondsLeft, logout]);

  return (
    <ScreenContainer
      scrollable={false}
      className="justify-center items-center px-6"
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Card Container */}
      <View
        style={{
          padding: WP("6%"),
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.5)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 15,
          elevation: 8,
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Icon Badge */}
        <View
          className="mb-4 items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            backgroundColor: `${COLORS.error}15`,
          }}
        >
          <MaterialIcons name="gpp-bad" size={48} color={COLORS.error} />
        </View>

        {/* Heading */}
        <CustomText
          variant="primary"
          weight="bold"
          size="lg"
          className="text-center mb-2"
        >
          Access Restricted
        </CustomText>

        {/* Description */}
        <CustomText
          variant="secondary"
          size="sm"
          className="text-center mb-4 leading-5"
        >
          Your account role{" "}
          <CustomText weight="bold" variant="primary">
            ({(user?.role?.name || user?.type || "unknown").toUpperCase()})
          </CustomText>{" "}
          is not authorized to use this mobile application. Access is strictly
          reserved for Drivers and Owners.
        </CustomText>

        {/* Auto Logout Countdown Notice */}
        <View className="bg-amber-50 border border-amber-200 rounded-xl p-3 w-full mb-6 items-center">
          <CustomText variant="secondary" size="xs" className="text-center">
            You will be automatically logged out in{" "}
            <CustomText weight="bold" style={{ color: COLORS.primary }}>
              {secondsLeft}s
            </CustomText>
          </CustomText>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Log Out Now"
          className="w-full py-3.5 rounded-xl items-center justify-center flex-row gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          <MaterialIcons name="logout" size={20} color="#FFFFFF" />
          <CustomText weight="semibold" size="md" style={{ color: "#FFFFFF" }}>
            Log Out Now
          </CustomText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
