import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface ILoginOptionsRowProps {
  readonly rememberMe: boolean;
  readonly setRememberMe: (value: boolean) => void;
}

export function LoginOptionsRow({
  rememberMe,
  setRememberMe,
}: Readonly<ILoginOptionsRowProps>) {
  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <View className="flex-row items-center justify-between mt-5 mb-2">
      <TouchableOpacity
        onPress={() => setRememberMe(!rememberMe)}
        className="flex-row items-center"
        activeOpacity={0.8}
      >
        <View
          style={{
            width: WP("3.5%"),
            height: WP("3.5%"),
            minWidth: 18,
            minHeight: 18,
            marginRight: WP("2%"),
          }}
          className={`border rounded items-center justify-center ${
            rememberMe
              ? "bg-primary border-primary"
              : "border-accent bg-transparent"
          }`}
        >
          {rememberMe && <MaterialIcons name="check" size={14} color="white" />}
        </View>
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") - 1 }}
          className="font-medium text-accent"
        >
          Remember me
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") - 1 }}
          className="font-semibold text-primary"
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}
