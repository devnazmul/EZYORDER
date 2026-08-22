import { getResponsiveFontSize } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export function AuthHeader() {
  return (
    <View className="items-center my-4">
      <View className="w-16 h-16 bg-primary rounded-lg items-center justify-center shadow-lg mb-4">
        <MaterialIcons name="restaurant" size={36} color="white" />
      </View>
      <Text
        style={{ fontSize: getResponsiveFontSize("2xl") }}
        className="text-2xl font-bold text-neutral"
      >
        EZYORDER
      </Text>

      <Text
        style={{ fontSize: getResponsiveFontSize("lg") }}
        className="font-medium tracking-wide text-center"
      >
        Manage your restaurant, anywhere
      </Text>
    </View>
  );
}
